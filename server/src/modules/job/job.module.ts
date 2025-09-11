import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../core/database/database.module';

import { JobController } from './job.controller';
import { JobDispatcher } from './job.dispatcher';
import { JobScheduler } from './job.scheduler';
import { JobService } from './job.service';
import { JobHistoryRepository, JobScheduleRepository } from './repositories';

@Module({
  imports: [BullModule.registerQueue({ name: 'job' }), DatabaseModule],
  controllers: [JobController],
  providers: [JobService, JobDispatcher, JobScheduler, JobScheduleRepository, JobHistoryRepository],
  exports: [JobService, JobDispatcher, JobScheduler],
})
export class JobModule {}
