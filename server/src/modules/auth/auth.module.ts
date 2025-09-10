import { Module } from '@nestjs/common';

import { AccountModule } from '../account/account.module';
import { PermissionModule } from '../permission/permission.module';

import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [PermissionModule, AccountModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
