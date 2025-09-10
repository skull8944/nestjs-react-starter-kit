import { Test, TestingModule } from '@nestjs/testing';

import { Setting } from '@prisma/client';

import { SettingKey } from './setting-key';
import { SettingRepository } from './setting.repository';
import { SettingService } from './setting.service';

describe('SettingService', () => {
  let service: SettingService;
  let repo: SettingRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingService,

        {
          provide: SettingRepository,
          useValue: {
            findFirstSettingByKey: jest.fn(),
          },
        },
      ],
    }).compile();

    service = await module.resolve<SettingService>(SettingService);
    repo = module.get<SettingRepository>(SettingRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSettingByKey', () => {
    it('should return a setting', async () => {
      const setting: Setting = {
        key: SettingKey.Mail as unknown as string,
        isEnabled: true,
        value1: [],
        description: null,
        value2: null,
        value3: null,
      };
      jest.spyOn(repo, 'findFirstSettingByKey').mockResolvedValueOnce(setting);

      await expect(service.getSettingByKey(SettingKey.Mail)).resolves.toEqual(setting);
    });
  });
});
