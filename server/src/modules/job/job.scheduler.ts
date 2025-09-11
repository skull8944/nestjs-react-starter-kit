import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { Queue } from 'bullmq';
import { CronExpressionParser } from 'cron-parser';
import lodash from 'lodash';

import { DateUtil } from '@/utils/date';

import { JobScheduleRepository } from './repositories';
import type { JobQueueData } from './types';

@Injectable()
export class JobScheduler {
  private readonly logger = new Logger(JobScheduler.name);

  constructor(
    @InjectQueue('job') private readonly jobQueue: Queue<JobQueueData>,
    private readonly jobScheduleRepo: JobScheduleRepository,
  ) {}

  // every minute
  @Cron('*/1 * * * *')
  async enqueueJobs(): Promise<void> {
    const nowDayjs = DateUtil.getNowDayjs();

    this.logger.log('Enqueuing jobs...');
    const schedules = await this.jobScheduleRepo.find({
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
            data: lodash.pick(s, 'id', 'jobName', 'param', 'timeout') satisfies JobQueueData,
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
}
