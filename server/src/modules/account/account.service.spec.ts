import { Test, type TestingModule } from '@nestjs/testing';

import { AccountRepository } from './account.repository';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let service: AccountService;
  let repo: AccountRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,

        {
          provide: AccountRepository,
          useValue: {
            findFirst: jest.fn(),
            findFirstWithRole: jest.fn(),
            find: jest.fn(),
            findWithRole: jest.fn(),
            create: jest.fn(),
            edit: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    service = await module.resolve<AccountService>(AccountService);
    repo = module.get<AccountRepository>(AccountRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findFirstAccount', () => {
    it('should call repo fn', async () => {
      const args = { where: { emplid: '123' } };
      await service.findFirst(args);

      expect(repo.findFirst).toHaveBeenCalledWith(args);
    });
  });

  describe('findFirstAccountWithRole', () => {
    it('should call repo fn', async () => {
      const args = { where: { emplid: '123' } };
      await service.findFirstWithRole(args);

      expect(repo.findFirstWithRole).toHaveBeenCalledWith(args);
    });
  });

  describe('findAccount', () => {
    it('should call repo fn', async () => {
      const args = { where: { emplid: '123' } };
      await service.find(args);

      expect(repo.find).toHaveBeenCalledWith(args);
    });
  });

  describe('findAccountWithRole', () => {
    it('should call repo fn', async () => {
      const args = { where: { emplid: '123' } };
      await service.findWithRole(args);

      expect(repo.findWithRole).toHaveBeenCalledWith(args);
    });
  });

  describe('createAccount', () => {
    it('should call repo fn', async () => {
      const data = { emplid: '123', name: 'John Doe' } as Parameters<
        AccountRepository['create']
      >[0]['data'];
      await service.create(data);

      expect(repo.create).toHaveBeenCalledWith({ data });
    });
  });

  describe('editAccount', () => {
    it('should call repo fn', async () => {
      const args = {
        where: { emplid: '123' },
        data: { name: 'John Doe' },
      } as Parameters<AccountRepository['edit']>[0];
      await service.edit(args);

      expect(repo.edit).toHaveBeenCalledWith(args);
    });
  });

  describe('countAccount', () => {
    it('should call repo fn', async () => {
      const args = { where: { emplid: '123' } };
      await service.count(args);

      expect(repo.count).toHaveBeenCalledWith(args);
    });
  });
});
