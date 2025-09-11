import { HttpService } from '@nestjs/axios';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger, Scope } from '@nestjs/common';

import type { JobSchedule } from '@prisma/client';
import { Prisma } from '@prisma/client';

import { Job } from 'bullmq';
import lodash from 'lodash';
import { firstValueFrom } from 'rxjs';

import { DateUtil } from '@/utils/date';

import { JobHistoryRepository, JobScheduleRepository } from './repositories';

@Injectable({ scope: Scope.REQUEST })
@Processor('job')
export class JobDispatcher extends WorkerHost {
  private readonly logger = new Logger(JobDispatcher.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly jobHistoryRepo: JobHistoryRepository,
    private readonly jobScheduleRepo: JobScheduleRepository,
  ) {
    super();
  }

  async process(job: Job<Pick<JobSchedule, 'id' | 'jobName' | 'param'>>) {
    const { jobName, param, id } = job.data;

    this.logger.log(`Processing job ${job.id}: ${jobName}`);

    // 獲取完整的任務資訊 (包括優先級和超時設定等)
    const jobSchedule = await this.jobScheduleRepo.findById(id);
    const timeout = jobSchedule?.timeout || 300000; // 預設5分鐘超時

    const startAt = DateUtil.getNowDayjs().toDate();
    const jobHistory = await this.jobHistoryRepo.create({
      jobName,
      param: lodash.isNil(param) ? Prisma.JsonNull : param,
      status: 'PROCESSING',
      startAt,
    });

    // 使用 Promise.race 實現超時控制
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Job ${jobName} timed out after ${timeout}ms`)), timeout);
      });

      // 創建實際的 job 執行 Promise
      const jobPromise = this.executeJob(jobName, param as never);

      // 競爭執行，哪個先完成或拋出錯誤則返回該結果
      await Promise.race([jobPromise, timeoutPromise]);

      this.logger.log(`Job ${job.id} completed successfully`);
      jobHistory.status = 'SUCCESS';
    } catch (error: unknown) {
      jobHistory.status = 'FAILED';
      jobHistory.error =
        error instanceof Error
          ? JSON.stringify({ message: error.message, stack: error.stack })
          : JSON.stringify(error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';

      this.logger.error(`Job ${job.id} failed: ${errorMessage}`, errorStack);
      // Re-throw the error to trigger BullMQ retry mechanism
      throw error;
    } finally {
      const endAt = DateUtil.getNowDayjs().toDate();
      jobHistory.endAt = endAt;

      await this.jobHistoryRepo.edit(
        jobHistory.id,
        lodash.pick(jobHistory, 'status', 'error', 'endAt'),
      );
    }
  }

  // 將實際的 job 執行邏輯抽離成獨立方法，方便測試和維護
  private async executeJob(jobName: string, param: never): Promise<void> {
    // call self
    await firstValueFrom(
      this.httpService.post(
        '/v1/job/call-job',
        {
          methodName: jobName,
          param,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );
  }
}
