import { Test, type TestingModule } from '@nestjs/testing';

import type { Account, Menu, Role, VwMenu } from '@prisma/client';

import { Pagination, PaginationRequest } from '../../utils/pagination';
import { AccountService } from '../account/account.service';
import { ReqUser } from '../auth/dtos/req-user';

import {
  PermissionAddPersonDto,
  PermissionEditPersonDto,
  PermissionPersonTableQueryDto,
} from './dtos';
import { PermissionService } from './permission.service';
import { MenuRepository, RoleRepository } from './repositories';

describe('PermissionService', () => {
  let service: PermissionService;
  let menuRepo: MenuRepository;
  let roleRepo: RoleRepository;
  let accountService: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,

        {
          provide: MenuRepository,
          useValue: {
            findVwMenu: jest.fn(),
            findIdsByEmplid: jest.fn(),
            findPaths: jest.fn(),
            findPathsByEmplid: jest.fn(),
            find: jest.fn(),
            findFirst: jest.fn(),
            findFirstWithChildren: jest.fn(),
          },
        },

        {
          provide: RoleRepository,
          useValue: {
            findFirst: jest.fn(),
            findFirstWithMenu: jest.fn(),
            find: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
            edit: jest.fn(),
            delete: jest.fn(),
          },
        },

        {
          provide: AccountService,
          useValue: {
            findFirstWithRole: jest.fn(),
            edit: jest.fn(),
            findWithRole: jest.fn(),
            count: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = await module.resolve(PermissionService);
    menuRepo = module.get(MenuRepository);
    roleRepo = module.get(RoleRepository);
    accountService = module.get(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const vwMenus: VwMenu[] = [
    {
      id: '0',
      index: 0,
      type: 'Directory',
      key: '0',
      title: '0',
      label: '0',
      disabled: false,
      parentId: null,
      depthPath: null,
      parentIndex: null,
    },
    {
      id: '0-0',
      index: 0,
      type: 'Page',
      key: '0-0',
      title: '0-0',
      label: '0-0',
      disabled: false,
      parentId: '0',
      depthPath: '0-0',
      parentIndex: 0,
    },
    {
      id: '0-1',
      index: 1,
      type: 'Page',
      key: '0-1',
      title: '0-1',
      label: '0-1',
      disabled: false,
      parentId: '0',
      depthPath: '0-1',
      parentIndex: 0,
    },
    {
      id: '0-1-0',
      index: 0,
      type: 'Feature',
      key: '0-1-0',
      title: '0-1-0',
      label: '0-1-0',
      disabled: false,
      parentId: '0-1',
      depthPath: '0-1-0',
      parentIndex: 1,
    },
  ];

  const user = { emplid: 'UT' } as ReqUser;

  describe('buildMenuTree', () => {
    it('should build menu tree', async () => {
      jest.spyOn(menuRepo, 'findVwMenu').mockResolvedValueOnce(vwMenus);

      await expect(
        service.buildMenuTree({ key: 'key', setDisabledFn: () => false }),
      ).resolves.toEqual([
        {
          id: '0',
          key: '0',
          title: '0',
          label: '0',
          disabled: false,
          type: 'Directory',
          children: [
            {
              id: '0-0',
              key: '0-0',
              title: '0-0',
              label: '0-0',
              disabled: false,
              type: 'Page',
              children: [],
            },
            {
              id: '0-1',
              key: '0-1',
              title: '0-1',
              label: '0-1',
              disabled: false,
              type: 'Page',
              children: [
                {
                  id: '0-1-0',
                  key: '0-1-0',
                  title: '0-1-0',
                  label: '0-1-0',
                  disabled: false,
                  type: 'Feature',
                  children: [],
                },
              ],
            },
          ],
        },
      ]);
    });
  });

  describe('getAuthMenu', () => {
    it('should return menu tree', async () => {
      jest.spyOn(menuRepo, 'findIdsByEmplid').mockResolvedValueOnce(['0', '0-1']);
      jest.spyOn(menuRepo, 'findVwMenu').mockResolvedValueOnce(vwMenus);

      await expect(service.getAuthMenu(user)).resolves.toEqual([
        {
          id: '0',
          key: '0',
          title: '0',
          label: '0',
          disabled: false,
          type: 'Directory',
          children: [
            {
              id: '0-0',
              key: '0-0',
              title: '0-0',
              label: '0-0',
              disabled: true,
              type: 'Page',
              children: [],
            },
            {
              id: '0-1',
              key: '0-1',
              title: '0-1',
              label: '0-1',
              disabled: false,
              type: 'Page',
              children: [
                {
                  id: '0-1-0',
                  key: '0-1-0',
                  title: '0-1-0',
                  label: '0-1-0',
                  disabled: true,
                  type: 'Feature',
                  children: [],
                },
              ],
            },
          ],
        },
      ]);
    });
  });

  describe('getRoleMenu', () => {
    it('should throw error when role cannot be found', async () => {
      const roleId = 'roleId';
      jest.spyOn(roleRepo, 'findFirstWithMenu').mockResolvedValueOnce(null);

      await expect(service.getRoleMenu(roleId)).rejects.toThrow(
        `Can't find role for id: '${roleId}'`,
      );
    });

    it('should return role menu tree', async () => {
      jest.spyOn(menuRepo, 'findVwMenu').mockResolvedValueOnce(vwMenus);

      await expect(service.getRoleMenu()).resolves.toEqual({
        checked: [],
        all: [
          {
            id: '0',
            key: '0',
            title: '0',
            label: '0',
            disabled: false,
            type: 'Directory',
            children: [
              {
                id: '0-0',
                key: '0-0',
                title: '0-0',
                label: '0-0',
                disabled: false,
                type: 'Page',
                children: [],
              },
              {
                id: '0-1',
                key: '0-1',
                title: '0-1',
                label: '0-1',
                disabled: false,
                type: 'Page',
                children: [
                  {
                    id: '0-1-0',
                    key: '0-1-0',
                    title: '0-1-0',
                    label: '0-1-0',
                    disabled: false,
                    type: 'Feature',
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      });
    });
  });

  // describe('findFirstHREmployeeByEmplid', () => {
  //   it('should return HR employee', async () => {
  //     const emplid = 'ut';
  //     const hrEmployee = {
  //       emplid,
  //     } as Awaited<ReturnType<typeof accountService.findFirstHREmployeeByEmplid>>;

  //     jest.spyOn(accountService, 'findFirstHREmployeeByEmplid').mockResolvedValueOnce(hrEmployee);

  //     await expect(accountService.findFirstHREmployeeByEmplid(emplid)).resolves.toEqual(hrEmployee);
  //   });
  // });

  describe('searchPerson', () => {
    it('should return person search results', async () => {
      const pagination = new Pagination({ current: 1, pageSize: 3, total: 0 });
      const total = 30;

      jest.spyOn(accountService, 'count').mockResolvedValueOnce(total);
      jest.spyOn(accountService, 'findWithRole').mockResolvedValueOnce(
        Array.from({ length: 3 }, (_, i) => ({
          emplid: `emplid${i}`,
          name: `name${i}`,
          roles: [
            {
              role: {
                id: `role${i}`,
                name: `roleName${i}`,
              },
            },
          ],
          disabled: i % 2 === 0,
        })) as Awaited<ReturnType<typeof accountService.findWithRole>>,
      );

      const req = new PaginationRequest<PermissionPersonTableQueryDto>({
        pagination,
        query: new PermissionPersonTableQueryDto({
          keyword: 'keyword',
          roles: ['role1'],
          active: true,
        }),
        sorters: [],
      });

      await expect(service.searchPerson(req)).resolves.toEqual({
        pagination: { ...pagination, total },
        sorters: [],
        data: Array.from({ length: 3 }, (_, i) => ({
          emplid: `emplid${i}`,
          name: `name${i}`,
          roles: [
            {
              id: `role${i}`,
              name: `roleName${i}`,
            },
          ],
          active: i % 2 === 1,
        })),
      });
    });
  });

  describe('addPerson', () => {
    const body = new PermissionAddPersonDto({
      emplid: 'emplid',
      name: 'name',
      email: 'email@wistron.com',
      roles: ['role1', 'role2'],
      active: true,
    });

    beforeEach(() => {
      jest.spyOn(accountService, 'create').mockResolvedValueOnce({} as Account);
    });

    it('should throw error when account already exists', async () => {
      jest.spyOn(accountService, 'findFirst').mockResolvedValueOnce({} as Account);

      await expect(service.addPerson(body, user)).rejects.toThrow(
        `Account already exists for emplid: '${body.emplid}'`,
      );
    });

    it('should create account', async () => {
      jest.spyOn(accountService, 'findFirst').mockResolvedValueOnce(null);
      jest
        .spyOn(roleRepo, 'find')
        .mockResolvedValueOnce(body.roles.map((id) => ({ id })) as Role[]);

      await expect(service.addPerson(body, user)).resolves.toEqual(undefined);

      expect(accountService.create).toHaveBeenCalledWith({
        emplid: body.emplid,
        email: body.email,
        name: body.name,
        disabled: !body.active,

        roles: {
          createMany: {
            data: body.roles.map((roleId) => ({ roleId })),
          },
        },

        createdBy: user.emplid,
        createdAt: expect.any(Date),
        updatedBy: user.emplid,
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('editPerson', () => {
    const body = new PermissionEditPersonDto({
      emplid: 'emplid',
      roles: ['role1', 'role2'],
      active: true,
    });

    beforeEach(() => {
      jest.spyOn(accountService, 'edit').mockResolvedValueOnce({} as Account);
    });

    it('should throw error when account not found', async () => {
      jest.spyOn(accountService, 'findFirst').mockResolvedValueOnce(null);

      await expect(service.editPerson(body, user)).rejects.toThrow(
        `Can't find account for emplid: '${body.emplid}'`,
      );
    });

    it('should update account', async () => {
      const account = {
        emplid: body.emplid,
        disabled: false,
      } as Account;

      jest.spyOn(accountService, 'findFirst').mockResolvedValueOnce(account);

      await expect(service.editPerson(body, user)).resolves.toEqual(undefined);

      expect(accountService.edit).toHaveBeenCalledWith({
        where: { emplid: body.emplid },
        data: {
          disabled: !body.active,
          updatedBy: user.emplid,
          updatedAt: expect.any(Date),
          roles: {
            deleteMany: {
              emplid: body.emplid,
            },

            createMany: {
              data: body.roles.map((roleId) => ({ roleId })),
            },
          },
        },
      });
    });
  });

  describe('searchRole', () => {
    it('should return role search results', async () => {
      const pagination = new Pagination({ current: 1, pageSize: 3, total: 0 });
      const total = 30;

      jest.spyOn(roleRepo, 'count').mockResolvedValueOnce(total);
      jest.spyOn(roleRepo, 'find').mockResolvedValueOnce(
        Array.from({ length: 3 }, (_, i) => ({
          id: `roleId${i}`,
          name: `roleName${i}`,
        })) as Awaited<ReturnType<typeof roleRepo.find>>,
      );

      const req = new PaginationRequest({
        pagination,
        query: {},
        sorters: [],
      });

      await expect(service.searchRole(req)).resolves.toEqual({
        pagination: { ...pagination, total },
        sorters: [],
        data: Array.from({ length: 3 }, (_, i) => ({
          id: `roleId${i}`,
          name: `roleName${i}`,
        })),
      });
    });
  });

  describe('addRole', () => {
    it('should throw error when body has no permissions', async () => {
      await expect(
        service.addRole(
          {
            name: 'roleName',
            views: [],
            admins: [],
          },
          user,
        ),
      ).rejects.toThrow('Adding role must have name and permissions');
    });

    it('should create role', async () => {
      jest
        .spyOn(menuRepo, 'findFirst')
        .mockResolvedValueOnce({
          id: 'dashboard',
          key: '/dashboard',
        } as Menu)
        .mockResolvedValueOnce({
          id: 'admin',
          key: '/admin',
        } as Menu);

      await service.addRole(
        {
          name: 'roleName',
          views: ['view'],
          admins: ['admin-1'],
        },
        user,
      );

      expect(roleRepo.create).toHaveBeenCalledWith({
        name: 'roleName',
        createdBy: user.emplid,
        createdAt: expect.any(Date),
        updatedBy: user.emplid,
        updatedAt: expect.any(Date),
        menus: {
          createMany: {
            data: [
              { menuId: 'dashboard' },
              { menuId: 'view' },
              { menuId: 'admin-1' },
              { menuId: 'admin' },
            ],
          },
        },
      });
    });
  });

  describe('editRole', () => {
    it('should throw error when body has no permissions', async () => {
      await expect(
        service.editRole(
          {
            id: 'roleId',
            views: [],
            admins: [],
          },
          user,
        ),
      ).rejects.toThrow('Editing role must have id and permissions');
    });

    it('should update role', async () => {
      const roleId = 'roleId';
      const body = {
        id: roleId,
        views: ['view'],
        admins: ['admin-1'],
      };

      jest
        .spyOn(menuRepo, 'findFirst')
        .mockResolvedValueOnce({
          id: 'dashboard',
          key: '/dashboard',
        } as Menu)
        .mockResolvedValueOnce({
          id: 'admin',
          key: '/admin',
        } as Menu);

      await service.editRole(body, user);

      expect(roleRepo.edit).toHaveBeenCalledWith({
        where: { id: roleId },
        data: {
          updatedBy: user.emplid,
          updatedAt: expect.any(Date),
          menus: {
            deleteMany: {
              roleId,
            },

            createMany: {
              data: [
                { menuId: 'dashboard' },
                { menuId: 'view' },
                { menuId: 'admin-1' },
                { menuId: 'admin' },
              ],
            },
          },
        },
      });
    });
  });

  describe('deleteRole', () => {
    it('should throw error when role not found', async () => {
      const roleId = 'roleId';
      jest.spyOn(roleRepo, 'findFirst').mockResolvedValueOnce(null);

      await expect(service.deleteRole(roleId)).rejects.toThrow(
        `Can't find role for id: '${roleId}'`,
      );
    });

    it('should delete role', async () => {
      const roleId = 'roleId';
      jest.spyOn(roleRepo, 'findFirst').mockResolvedValueOnce({} as Role);

      await expect(service.deleteRole(roleId)).resolves.toEqual(undefined);

      expect(roleRepo.delete).toHaveBeenCalledWith({ where: { id: roleId } });
    });
  });
});
