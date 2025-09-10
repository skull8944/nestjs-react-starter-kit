import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';

import type { Account } from '@prisma/client';

import { AccountService } from '../account/account.service';
import { PermissionService } from '../permission/permission.service';

import { AuthService } from './auth.service';
import type { MsGraphUser } from './types';

describe('AuthService', () => {
  let service: AuthService;
  let cacheManager: Cache;
  let accountService: AccountService;
  let permissionService: PermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,

        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({
              AAD_CLIENT_ID: 'test-client-id',
              AAD_TENANT_ID: 'test-tenant-id',
              aadClientSecret: 'test-client-secret',
            }),
          },
        },

        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },

        {
          provide: AccountService,
          useValue: {
            findFirst: jest.fn(),
            create: jest.fn(),
          },
        },

        {
          provide: PermissionService,
          useValue: {
            getAuthMenu: jest.fn(),
          },
        },
      ],
    }).compile();

    service = await module.resolve(AuthService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    accountService = module.get(AccountService);
    permissionService = module.get(PermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    const user = {
      mailNickname: 'test-user-id',
      displayName: 'Test User',
    } as MsGraphUser;

    it('should throw error when user is not in account table', async () => {
      jest.spyOn(accountService, 'findFirst').mockResolvedValueOnce(null);

      await expect(service.checkUserOrCreate(user)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw error when user is in account table and disabled', async () => {
      jest
        .spyOn(accountService, 'findFirst')
        .mockResolvedValueOnce({ emplid: 'test-user-id', disabled: true } as Account);

      await expect(service.checkUserOrCreate(user)).rejects.toThrow(UnauthorizedException);
    });

    it('should pass validation when user is in account table and not disabled', async () => {
      jest
        .spyOn(accountService, 'findFirst')
        .mockResolvedValueOnce({ emplid: 'test-user-id', disabled: false } as Account);

      await expect(service.checkUserOrCreate(user)).resolves.not.toThrow();
    });
  });
});
