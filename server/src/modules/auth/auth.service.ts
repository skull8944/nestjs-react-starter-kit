import {
  type AuthenticationResult,
  ConfidentialClientApplication,
  type OnBehalfOfRequest,
} from '@azure/msal-node';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, Scope, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { Account } from '@prisma/client';

import { Cache } from 'cache-manager';

import { AzureService } from '../../core/azure/service';

import { AllConfig } from '../../types/all-config.type';
import { AccountService } from '../account/account.service';

import { LoginRequestDto, LoginResponseDto } from './dtos';
import type { MsGraphUser } from './types';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private get msalConfig() {
    return this.configService.get('msal', { infer: true })!;
  }

  private readonly msalClient: ConfidentialClientApplication;

  private readonly MS_GRAPH_USER_URL =
    'https://graph.microsoft.com/v1.0/me?$select=mail,displayName,surname,userType,depId,department,id,mailNickname,officeLocation,businessPhones';

  constructor(
    private readonly configService: ConfigService<AllConfig>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly accountService: AccountService,
  ) {
    const {
      AAD_CLIENT_ID: clientId,
      AAD_TENANT_ID: tenantId,
      aadClientSecret: clientSecret,
    } = this.msalConfig;

    this.msalClient = AzureService.createMsalClient({
      clientId,
      tenantId,
      clientSecret,
      logger: this.logger,
    });
  }

  static readonly extractBearerToken = (bearerToken: Nillable<string>): string => {
    const bearerTokenArray = bearerToken?.split(' ') ?? [];

    if (bearerTokenArray.length !== 2) {
      throw new UnauthorizedException('Invalid bearer token');
    }

    return bearerTokenArray[1];
  };

  /**
   * 透過 access token 請求對其他資源的存取權限 token
   * @param token
   * @param scopes 要求的權限範圍 (預設為 api://{clientId}/.default)
   * @returns
   */
  public acquireTokenOnBehalfOf(
    token: string,
    scopes: string[],
  ): Promise<AuthenticationResult | null> {
    const oboRequest: OnBehalfOfRequest = {
      oboAssertion: token,
      scopes,
    };

    return this.msalClient.acquireTokenOnBehalfOf(oboRequest);
  }

  public async getUserInfoByMSGraphAPI(accessToken: string): Promise<MsGraphUser> {
    const res = await fetch(this.MS_GRAPH_USER_URL, {
      headers: { Authorization: accessToken },
    });

    const data: MsGraphUser = await res.json();

    if (!data) {
      throw new Error('Failed to get user info from Microsoft Graph API');
    }

    return data;
  }

  public clearCacheWithAccessToken(accessToken: string): Promise<boolean> {
    return this.cacheManager.del(accessToken);
  }

  public async getUserInfo(accessToken: string): Promise<MsGraphUser> {
    // if the token is not in cache, we need to get user info from Microsoft Graph API
    const oboUserRead = await this.acquireTokenOnBehalfOf(accessToken, ['User.Read']);

    if (!oboUserRead) {
      throw new UnauthorizedException('Failed to get user info');
    }

    const msGraphUser = await this.getUserInfoByMSGraphAPI(oboUserRead.accessToken);

    // ! check whether the response has emplid
    if (!msGraphUser?.mailNickname) {
      throw new UnauthorizedException('Failed to get user info');
    }

    return msGraphUser;
  }

  public async checkUserOrCreate(user: MsGraphUser): Promise<Account> {
    let account: Account | null = await this.accountService.findFirst({
      where: {
        emplid: user.mailNickname,
      },
    });

    account ??= await this.accountService.create({
      emplid: user.mailNickname,
      name: user.displayName,
      email: user.mail,
      disabled: false,
    });

    if (!account || account.disabled) {
      throw new UnauthorizedException('您無權限訪問此系統，請與系統管理者聯繫');
    }

    return account;
  }

  public async login({ accessToken }: LoginRequestDto): Promise<LoginResponseDto> {
    let user: MsGraphUser;

    try {
      user = await this.getUserInfo(accessToken);
    } catch {
      throw new UnauthorizedException('Failed to get user info');
    }

    const account = await this.checkUserOrCreate(user!);

    return new LoginResponseDto({
      emplid: account.emplid,
      name: account.name,
      email: account.email,
    });
  }
}
