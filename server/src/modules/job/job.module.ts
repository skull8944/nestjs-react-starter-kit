import { Module } from '@nestjs/common';

import { JobController } from './job.controller';
import { JobDispatcher } from './job.dispatcher';
import { JobService } from './job.service';
import { JobHistoryRepository, JobScheduleRepository } from './repositories';

@Module({
  imports: [],
  controllers: [JobController],
  providers: [JobService, JobDispatcher, JobScheduleRepository, JobHistoryRepository],
  exports: [JobService, JobDispatcher],
})
export class JobModule {}
