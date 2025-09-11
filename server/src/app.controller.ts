import { Controller, Get, Logger, Param } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { PrismaService } from './core/database/prisma.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly health: HealthCheckService,
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
