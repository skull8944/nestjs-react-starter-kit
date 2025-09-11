import { BadRequestException, Injectable, Logger, Scope } from '@nestjs/common';

import { ReqUser } from '../auth/dtos/req-user';

import { CallJobDto } from './dtos';

@Injectable({ scope: Scope.REQUEST })
export class JobService {
  private readonly logger = new Logger(JobService.name);

  constructor() {}

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
