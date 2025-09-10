import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from './prisma.service';
import { TransactionScope } from './transaction-scope';

@Global()
@Module({
  imports: [ConfigModule, ConfigModule],
  providers: [PrismaService, TransactionScope],
  exports: [PrismaService, TransactionScope],
})
export class DatabaseModule {}
