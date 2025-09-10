import { registerAs } from '@nestjs/config';

import { IsBooleanString, IsNumberString, IsOptional, IsString } from 'class-validator';

import validateConfig from '@/utils/validate-config';

export type JobConfig = {
  // Worker 設定
  workerConcurrency: number;
  // 延遲作業隊列設定
  stalledCheckInterval: number;
  maxStalledCount: number;
  // 作業清理設定
  cleanUpInterval: number;
  keepCompleted: number;
  // 監控設定
  enableMetrics: boolean;
  // Redis 連接設定
  redisPrefix: string;
};

class JobConfigSchema {
  @IsNumberString()
  @IsOptional()
  workerConcurrency!: number;

  @IsNumberString()
  @IsOptional()
  stalledCheckInterval!: number;

  @IsNumberString()
  @IsOptional()
  maxStalledCount!: number;

  @IsNumberString()
  @IsOptional()
  cleanUpInterval!: number;

  @IsNumberString()
  @IsOptional()
  keepCompleted!: number;

  @IsBooleanString()
  @IsOptional()
  enableMetrics!: boolean;

  @IsString()
  @IsOptional()
  redisPrefix!: string;
}

export default registerAs<JobConfig>('job', () => {
  validateConfig(process.env, JobConfigSchema);

  return {
    // Worker 設定
    workerConcurrency: +(process.env.JOB_WORKER_CONCURRENCY ?? 5),

    // 延遲作業隊列設定
    stalledCheckInterval: +(process.env.JOB_STALLED_CHECK_INTERVAL ?? 30000), // 檢查停滯作業的間隔 (ms)

    maxStalledCount: +(process.env.JOB_MAX_STALLED_COUNT ?? 2), // 最大停滯計數，超過此值作業會重試

    // 作業清理設定
    cleanUpInterval: +(process.env.JOB_CLEANUP_INTERVAL ?? 86400), // 清理間隔，預設1天 (秒)

    keepCompleted: +(process.env.JOB_KEEP_COMPLETED ?? 10000), // 保留多少已完成的作業

    // 監控設定
    enableMetrics: process.env.JOB_ENABLE_METRICS === 'true',

    // Redis 連接設定
    redisPrefix: process.env.JOB_REDIS_PREFIX ?? 'job:queue:', // Redis 鍵前綴
  };
});
