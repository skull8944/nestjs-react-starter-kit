import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

import { ReqUser } from '../auth/dtos/req-user';
import { User } from '../auth/user.decorator';

import { CallJobDto } from './dtos';
import { JobService } from './job.service';

@Controller('/v1/job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('/call-job')
  async doJob(@User() user: ReqUser, @Body() body: CallJobDto): Promise<void> {
    await this.jobService.callJob(body, user);
  }
}
