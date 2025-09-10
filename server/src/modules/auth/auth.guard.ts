import { AuthError } from '@azure/msal-node';

import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Account } from '@prisma/client';

import type { Request } from 'express';

import { AppConfig } from '../../core/config/app-config.type';

import { AuthService } from '../../modules/auth/auth.service';
import { PermissionService } from '../../modules/permission/permission.service';

import { SYSTEM_USER } from '../../constants';

import { ReqUser } from './dtos/req-user';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private readonly serverType: 'web' | 'job' = 'web';

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<AppConfig>,
    private readonly permissionService: PermissionService,
  ) {
    this.serverType = this.configService.get('SERVER_TYPE', { infer: true })!;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    let accessToken: Nillable<string> = null;

    try {
      const request: Request = context.switchToHttp().getRequest();
      console.log(request.path);
      if (
        new RegExp(
          ['/api\/health', '/auth\/login', 'health-ftp-check'].map((txt) => `(${txt})`).join('|'),
        ).test(request.path)
      ) {
        return true;
      }

      if (this.serverType === 'job') {
        request.user = new ReqUser(SYSTEM_USER as Account, () =>
          this.permissionService.getAllPermissions(),
        ) as ReqUser;

        return true;
      }

      const bearerToken = request.header('Authorization');

      accessToken = AuthService.extractBearerToken(bearerToken);

      const user = await this.authService.getUserInfo(accessToken);

      const account = await this.authService.checkUserOrCreate(user);

      request.user = new ReqUser(account, () =>
        this.permissionService.getPermissionsByEmplid(account.emplid),
      );

      return true;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof AuthError && 'errorNo' in error) {
        switch (error.errorNo) {
          case 500133:
            this.logger.error('Token expired');
            throw new UnauthorizedException('AADSTS500133');

          default:
            throw new UnauthorizedException();
        }
      }

      if (accessToken) {
        await this.authService.clearCacheWithAccessToken(accessToken);
      }

      throw new UnauthorizedException();
    }
  }
}
