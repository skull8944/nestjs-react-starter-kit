import { BadRequestException, Injectable, Scope } from '@nestjs/common';

import type { Menu, Prisma, Role, VwMenu } from '@prisma/client';

import lodash from 'lodash';

import type { TransactionManager } from '../../core/database/types';

import { DateUtil } from '../../utils/date';
import { PaginationRequest, PaginationResponse } from '../../utils/pagination';
import { QueryUtil } from '../../utils/query';
import { AccountService } from '../account/account.service';
import { ReqUser } from '../auth/dtos/req-user';

import {
  PermissionAddPersonDto,
  PermissionAddRoleDto,
  PermissionAntdNodeDto,
  PermissionEditPersonDto,
  PermissionEditRoleDto,
  PermissionPersonTableDto,
  PermissionPersonTableQueryDto,
  PermissionRoleMenuDto,
  PermissionRoleTableDto,
  PermissionRoleTableQueryDto,
} from './dtos';
import { MenuRepository, RoleRepository } from './repositories';

@Injectable({ scope: Scope.REQUEST })
export class PermissionService {
  constructor(
    private readonly menuRepo: MenuRepository,
    private readonly roleRepo: RoleRepository,
    private readonly accountService: AccountService,
  ) {}

  /* istanbul ignore next */
  static async adjustSiblingIndexAfterDelete(menu: Menu, m: TransactionManager): Promise<void> {
    await m.menu.updateMany({
      data: {
        index: {
          decrement: 1,
        },
      },
      where: {
        index: {
          gt: menu.index,
        },
        parentId: menu.parentId,
      },
    });
  }

  /* istanbul ignore next */
  static async deleteMenu(
    key: Menu['key'],
    m: TransactionManager,
    deleteCounts = 1,
  ): Promise<void> {
    const menu = await m.menu.findFirst({
      relationLoadStrategy: 'join',
      include: {
        parent: true,
      },
      where: {
        key,
      },
    });

    if (!menu) return;

    const deleteIndexes = Array.from({ length: deleteCounts }, (_, i) => i + menu.index);

    await m.menu.deleteMany({
      where: {
        parentId: menu.parent?.id ?? null,
        index: {
          in: deleteIndexes,
        },
      },
    });

    await this.adjustSiblingIndexAfterDelete(menu, m);
  }

  /* istanbul ignore next */
  static async adjustSiblingIndexBeforeInsert(
    menu: Pick<Menu, 'index' | 'parentId'>,
    m: TransactionManager,
  ): Promise<void> {
    await m.menu.updateMany({
      data: {
        index: {
          increment: 1,
        },
      },
      where: {
        index: {
          gte: menu.index,
        },
        parentId: menu.parentId,
      },
    });
  }

  /* istanbul ignore next */
  static async addMenus(
    partialMenus: (Pick<Menu, 'index' | 'type' | 'key' | 'label'> &
      Partial<Omit<Menu, 'children'>> & {
        children?: (Pick<Menu, 'index' | 'type' | 'key' | 'label'> &
          Partial<Omit<Menu, 'children'>>)[];
      })[],

    m: TransactionManager,
  ) {
    if (!partialMenus.length) return;

    for (const pm of partialMenus) {
      const menuCreateInput: Prisma.MenuCreateInput = {
        ...pm,

        children: undefined,
        title: pm.title ?? pm.label,

        parent: {
          connect: pm.parentId ? { id: pm.parentId } : undefined,
        },
      };

      if ('parentId' in menuCreateInput) {
        delete menuCreateInput.parentId;
      }

      await this.adjustSiblingIndexBeforeInsert(
        {
          index: pm.index,
          parentId: pm.parentId ?? null,
        },
        m,
      );

      const menu = await m.menu.create({
        data: menuCreateInput,
      });

      if (!pm.children?.length) continue;

      pm.children.forEach((c) => {
        c.parentId = menu.id;
      });

      await this.addMenus(pm.children, m);
    }
  }

  /* istanbul ignore next */
  static async addRoles(
    roles: (Pick<Role, 'name'> & { permissions: Menu['key'][] })[],
    m: TransactionManager,
  ) {
    if (!roles.length) return;

    const addRole = async (role: (typeof roles)[number]) => {
      const dbPermissions = await m.menu.findMany({
        where: {
          key: { in: role.permissions },
        },
        select: {
          id: true,
        },
      });

      await m.role.create({
        data: {
          name: role.name,
          menus: {
            createMany: {
              data: dbPermissions.map(({ id }) => ({
                menuId: id,
              })),
            },
          },
        },
      });
    };

    await Promise.all(roles.map(addRole));
  }

  public async buildMenuTree({
    key,
    setDisabledFn = (menu) => menu.disabled,
  }: {
    key: 'id' | 'key';
    setDisabledFn?: (menu: VwMenu) => boolean;
  }): Promise<PermissionAntdNodeDto[]> {
    const menus = await this.menuRepo.findVwMenu();

    const parentMenuMap = menus.reduce<Map<string | null, VwMenu[]>>((map, menu) => {
      if (!map.has(menu.parentId)) {
        map.set(menu.parentId, []);
      }

      map.get(menu.parentId)!.push(menu);

      return map;
    }, new Map<string | null, VwMenu[]>());

    const buildMenuTree = (parentId: string | null): PermissionAntdNodeDto[] =>
      (parentMenuMap.get(parentId) ?? []).map<PermissionAntdNodeDto>((item) => ({
        id: item.id,
        key: item[key], // for menu -> 'path', for role edit tree -> 'id'
        title: item.title, // for role edit tree
        label: item.label, // for side menu
        disabled: setDisabledFn(item),
        type: item.type,
        children: buildMenuTree(item.id),
      }));

    return buildMenuTree(null);
  }

  public async getAuthMenu(user: Pick<ReqUser, 'emplid'>): Promise<PermissionAntdNodeDto[]> {
    const menuIds = await this.menuRepo.findIdsByEmplid(user.emplid);

    const menuIdSet = new Set<string>(menuIds.map((id) => id.toUpperCase()));

    return this.buildMenuTree({
      key: 'key',
      setDisabledFn: (menu) => menu.disabled || !menuIdSet.has(menu.id.toUpperCase()),
    });
  }

  public async getRoleMenu(roleId?: string): Promise<PermissionRoleMenuDto> {
    const role = roleId
      ? await this.roleRepo.findFirstWithMenu({
          where: {
            id: roleId,
          },
        })
      : null;

    if (roleId && !role) {
      throw new BadRequestException(`Can't find role for id: '${roleId}'`);
    }

    const checked: string[] = role?.menus?.length ? role.menus.map(({ menu }) => menu.id) : [];
    const menuTree = await this.buildMenuTree({ key: 'id' });

    return new PermissionRoleMenuDto({
      checked,
      all: menuTree,
    });
  }

  public async searchPerson(
    req: PaginationRequest<PermissionPersonTableQueryDto>,
  ): Promise<PaginationResponse<PermissionPersonTableDto>> {
    const { pagination, query, sorters } = req;

    const offset = QueryUtil.getPaginationOffset(pagination);
    const orderBy = QueryUtil.getOrderBy(sorters);
    const where: Prisma.AccountWhereInput = {
      ...(query?.keyword?.length
        ? {
            OR: [
              {
                emplid: {
                  contains: query.keyword,
                  mode: 'insensitive',
                },
              },
              {
                name: {
                  contains: query.keyword,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),

      ...(query?.roles?.length ? { roles: { some: { roleId: { in: query.roles } } } } : {}),

      ...(lodash.isNil(query?.active) ? {} : { disabled: !query.active }),
    };

    const findArgs: Pick<Prisma.AccountFindManyArgs, 'where' | 'orderBy'> = {
      where,
      orderBy: lodash.isEmpty(orderBy) ? { emplid: 'asc' } : orderBy,
    };

    const [accounts, total] = await Promise.all([
      this.accountService.findWithRole({
        ...findArgs,
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
        take: pagination.pageSize,
        skip: offset,
        orderBy: {
          name: 'asc',
        },
      }),
      this.accountService.count(findArgs),
    ]);

    pagination.total = total;

    const data: PermissionPersonTableDto[] = accounts.map((account) => {
      const roles = account.roles.map(({ role }) => ({
        id: role.id,
        name: role.name,
      }));

      return new PermissionPersonTableDto({
        active: !account.disabled,
        name: account.name,
        emplid: account.emplid,
        roles,
      });
    });

    return new PaginationResponse<PermissionPersonTableDto>({ pagination, sorters, data });
  }

  public async addPerson(body: PermissionAddPersonDto, user: ReqUser): Promise<void> {
    const person = await this.accountService.findFirst({
      where: { emplid: body.emplid },
    });

    if (person) {
      throw new BadRequestException(`Account already exists for emplid: '${body.emplid}'`);
    }

    const now = DateUtil.getNowDayjs().toDate();

    await this.accountService.create({
      emplid: body.emplid,
      name: body.name,
      disabled: !body.active,
      email: body.email,

      roles: {
        createMany: {
          data: body.roles.map((roleId) => ({
            roleId,
          })),
        },
      },

      createdBy: user.emplid,
      createdAt: now,
      updatedBy: user.emplid,
      updatedAt: now,
    });
  }

  public async editPerson(body: PermissionEditPersonDto, user: ReqUser): Promise<void> {
    const now = DateUtil.getNowDayjs().toDate();

    const account = await this.accountService.findFirst({
      where: { emplid: body.emplid },
    });

    if (!account) {
      throw new BadRequestException(`Can't find account for emplid: '${body.emplid}'`);
    }

    await this.accountService.edit({
      where: { emplid: body.emplid },
      data: {
        disabled: !body.active,
        updatedBy: user.emplid,
        updatedAt: now,
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
  }

  public async searchRole(
    req: PaginationRequest<PermissionRoleTableQueryDto>,
  ): Promise<PaginationResponse<PermissionRoleTableDto>> {
    const { pagination, query, sorters } = req;

    const where: Prisma.RoleWhereInput = {
      ...(query?.keyword?.length
        ? {
            name: {
              contains: query.keyword,
              mode: 'insensitive',
            },
          }
        : {}),
    };

    const [roles, total] = await Promise.all([
      this.roleRepo.find({
        where,
        skip: QueryUtil.getPaginationOffset(pagination),
        take: pagination.pageSize,
        orderBy: {
          name: 'asc',
        },
      }),
      this.roleRepo.count({ where }),
    ]);

    pagination.total = total;

    return new PaginationResponse<PermissionRoleTableDto>({
      pagination,
      sorters,
      data: roles.map((role) => new PermissionRoleTableDto({ id: role.id, name: role.name })),
    });
  }

  private async getSpecificMenuId(key: string): Promise<string> {
    const menu = await this.menuRepo.findFirst({
      where: {
        key,
      },
      select: {
        id: true,
      },
    });

    if (!menu) {
      throw new BadRequestException(`Can't find menu for key: '${key}'`);
    }

    return menu.id;
  }

  private async getDashboardPermissionId(): Promise<string> {
    return this.getSpecificMenuId('/dashboard');
  }

  private async getAdminPermissionId(): Promise<string> {
    return this.getSpecificMenuId('/admin');
  }

  public async addRole(
    { name, views, admins }: PermissionAddRoleDto,
    user: ReqUser,
  ): Promise<void> {
    if (!name || (!views?.length && !admins?.length)) {
      throw new BadRequestException('Adding role must have name and permissions');
    }

    const now = DateUtil.getNowDayjs().toDate();

    const role: Prisma.RoleCreateInput = {
      name: name.trim(),
      createdBy: user.emplid,
      createdAt: now,
      updatedBy: user.emplid,
      updatedAt: now,
    };

    const permissions = [await this.getDashboardPermissionId(), ...views, ...admins];
    if (admins.length) {
      const adminPermissionId = await this.getAdminPermissionId();

      permissions.push(adminPermissionId);
    }

    await this.roleRepo.create({
      ...role,
      menus: {
        createMany: {
          data: permissions.map((menuId) => ({ menuId })),
        },
      },
    });
  }

  public async editRole(
    { id, views, admins }: PermissionEditRoleDto,
    user: ReqUser,
  ): Promise<void> {
    if (!id || (!views?.length && !admins?.length)) {
      throw new BadRequestException('Editing role must have id and permissions');
    }

    const now = DateUtil.getNowDayjs().toDate();

    const role: Prisma.RoleUpdateInput = {
      updatedBy: user.emplid,
      updatedAt: now,
    };

    const permissions = [await this.getDashboardPermissionId(), ...views, ...admins];
    if (admins.length) {
      const adminPermissionId = await this.getAdminPermissionId();

      permissions.push(adminPermissionId);
    }

    await this.roleRepo.edit({
      where: { id },
      data: {
        ...role,
        menus: {
          deleteMany: {
            roleId: id,
          },

          createMany: {
            data: permissions.map((menuId) => ({ menuId })),
          },
        },
      },
    });
  }

  public async deleteRole(id: Role['id']): Promise<void> {
    const role = await this.roleRepo.findFirst({
      where: {
        id,
      },
    });

    if (!role) {
      throw new BadRequestException(`Can't find role for id: '${id}'`);
    }

    await this.roleRepo.delete({
      where: { id },
    });
  }

  public async getAllPermissions(): Promise<Menu['key'][]> {
    return this.menuRepo.findPaths();
  }

  public async getPermissionsByEmplid(emplid: string): Promise<Menu['key'][]> {
    return this.menuRepo.findPathsByEmplid(emplid);
  }
}
