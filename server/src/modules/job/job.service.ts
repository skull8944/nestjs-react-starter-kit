import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable, Logger, Scope } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { Queue } from 'bullmq';
import { CronExpressionParser } from 'cron-parser';
import lodash from 'lodash';

import { DateUtil } from '@/utils/date';

import { ReqUser } from '../auth/dtos/req-user';

import { CallJobDto } from './dtos';
import { JobScheduleRepository } from './repositories';

@Injectable({ scope: Scope.REQUEST })
export class JobService {
  private readonly logger = new Logger(JobService.name);

  constructor(
    @InjectQueue('job') private readonly jobQueue: Queue,
    private readonly jobScheduleRepository: JobScheduleRepository,
  ) {}

  // every minute
  @Cron('*/1 * * * *')
  async enqueueJobs(): Promise<void> {
    const nowDayjs = DateUtil.getNowDayjs();

    this.logger.log('Enqueuing jobs...');
    const schedules = await this.jobScheduleRepository.find({
      where: { isActive: true },
    });

    // 增加批次處理效能
    const jobsToAdd = schedules.reduce(
      (arr, s) => {
        try {
          // 根據觸發器類型處理任務觸發邏輯
          const interval = CronExpressionParser.parse(s.cron);
          const nextExecution = interval.next().toDate();

          const timeDiff = Math.abs(nowDayjs.diff(nextExecution, 'milliseconds'));
          // ! > 1min => pass
          if (timeDiff > 60 * 1000) return arr;

          arr.push({
            name: `job-${s.id}`,
            data: lodash.pick(s, 'id', 'jobName', 'param'),
            opts: {
              attempts: s.maxRetries,
              backoff: {
                type: 'exponential',
                delay: 1000,
              },
              // 增加任務優先級支援
              priority: s.priority,
              // 增加任務分組以支援批次管理
              jobId: `${s.jobName}-${s.id}-${nowDayjs.unix()}`,
            },
          });
        } catch (error) {
          this.logger.error(`Failed to parse cron for job ${s.id}: ${error}`);
        }

        return arr;
      },
      [] as Parameters<Queue['addBulk']>[0],
    );

    if (jobsToAdd.length > 0) {
      await this.jobQueue.addBulk(jobsToAdd);
      this.logger.log(`Enqueued ${jobsToAdd.length} jobs`);
    }
  }

  async callJob(body: CallJobDto, user: ReqUser): Promise<void> {
    const { methodName, param } = body;

    if (!this[methodName]) {
      this.logger.error(`callJob method not found: ${methodName}`);

      throw new BadRequestException(`callJob: method not found: ${methodName}`);
    }

    await this[methodName](param as never, user);
  }

  /**
   * Example job method that processes data
   * This would be triggered via the BullMQ queue and JobDispatcher
   */
  async processData(param: string[], user: ReqUser): Promise<void> {
    this.logger.log(`Processing data with params: ${param?.join(', ')}`);

    // Simulate some processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.logger.log('Data processing completed successfully');
  }

  /**
   * Example job method that generates a report
   * This would be triggered via the BullMQ queue and JobDispatcher
   */
  async generateReport(param: string[], user: ReqUser): Promise<void> {
    this.logger.log(`Generating report with params: ${param?.join(', ')}`);

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.logger.log('Report generated successfully');
  }
}
