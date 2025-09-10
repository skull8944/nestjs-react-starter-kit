import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Prisma, PrismaClient } from '@prisma/client';

import type { AllConfig } from '@/types/all-config.type';

const timeout = 1000 * 60 * 5; //設定5分鐘

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private isConnected = false;

  constructor(private readonly configService: ConfigService<AllConfig>) {
    super({
      log: ['error', 'warn', 'query'],
      transactionOptions: {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
        timeout,
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.isConnected = true;
      this.logger.log('Prisma connected');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to connect to Prisma: ${errorMessage}`);
      // 重試連接
      this.logger.log('Attempting to reconnect in 3 seconds...');
      setTimeout(async () => {
        try {
          await this.$connect();
          this.isConnected = true;
          this.logger.log('Prisma reconnected successfully');
        } catch (reconnectError: unknown) {
          const reconnectErrorMsg =
            reconnectError instanceof Error ? reconnectError.message : 'Unknown error';
          this.logger.error(`Failed to reconnect to Prisma: ${reconnectErrorMsg}`);
        }
      }, 3000);
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.$disconnect();
      this.isConnected = false;
      this.logger.log('Prisma disconnected');
    }
  }
}
