import { Controller, Get, InternalServerErrorException, Logger, Param } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import lodash from 'lodash';
import * as os from 'os';

import { PrismaService } from './core/database';

import { SettingKey } from './modules/setting/setting-key';
import { SettingService } from './modules/setting/setting.service';

import { AppService } from './app.service';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
    private readonly settingService: SettingService,
    private health: HealthCheckService,
  ) {}

  @Get('/health')
  @HealthCheck()
  readiness() {
    return this.health.check([
      async () => {
        try {
          await this.prismaService.$queryRaw`SELECT 1`;

          return { prisma: { status: 'up' } };
        } catch (error) {
          return { prisma: { status: 'down' } };
        }
      },
    ]);
  }

  @Get('/blob/:id')
  @ApiOkResponse({
    description: 'Get blob by id',
  })
  public async getBlob(@Param('id') id: string): Promise<{
    fileName: string;
    buffer: Buffer;
  }> {
    return {
      fileName: 'test',
      buffer: Buffer.from('test'),
    };
  }

  @Get('/log')
  public log(): void {
    if (process.env.NODE_ENV === 'prd') return;

    const logger = new Logger(AppController.name);

    logger.debug('test debug');
    logger.log('test info');
    logger.warn('test warn');
    logger.error('test error');
  }
}
