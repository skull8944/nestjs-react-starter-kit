import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../core/database/database.module';

import { AccountController } from './account.controller';
import { AccountRepository } from './account.repository';
import { AccountService } from './account.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
  exports: [AccountService],
})
export class AccountModule {}
