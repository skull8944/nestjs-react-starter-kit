import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../core/database';

import { AccountModule } from '../account/account.module';

import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { MenuRepository, RoleRepository } from './repositories';

@Module({
  imports: [DatabaseModule, AccountModule],
  controllers: [PermissionController],
  providers: [PermissionService, RoleRepository, MenuRepository],
  exports: [PermissionService],
})
export class PermissionModule {}
