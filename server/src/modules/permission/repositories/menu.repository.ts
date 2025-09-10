import { Injectable, Scope } from '@nestjs/common';

import type { Prisma } from '@prisma/client';

import { BaseRepository, TransactionScope } from '../../../core/database';

@Injectable({ scope: Scope.REQUEST })
export class MenuRepository extends BaseRepository<'menu' | 'vwMenu'> {
  constructor(protected readonly ts: TransactionScope) {
    super(ts);
  }

  public findVwMenu(args?: Prisma.VwMenuFindManyArgs) {
    return this.db.vwMenu.findMany();
  }

  private get joinAllAccountMenuSql() {
    return `--sql
      from permission.account_role ar
      join permission.role_menu rm
        on rm.role_id = ar.role_id
      join permission.menu m
        on rm.menu_id = m.id`;
  }

  public async findIdsByEmplid(emplid: string) {
    const res = await this.db.$queryRawUnsafe<{ id: string }[]>(
      `--sql
      select distinct m.id
      ${this.joinAllAccountMenuSql}
      where ar.emplid = $1`,
      emplid,
    );

    return res.map((r) => r.id);
  }

  public async findPaths() {
    const res = await this.db.$queryRawUnsafe<{ path: string }[]>(
      `--sql
      select distinct m.path
      ${this.joinAllAccountMenuSql}`,
    );

    return res.map((r) => r.path);
  }

  public async findPathsByEmplid(emplid: string) {
    const res = await this.db.$queryRawUnsafe<{ path: string }[]>(
      `--sql
      select distinct m.path
      ${this.joinAllAccountMenuSql}
      where ar.emplid = $1`,
      emplid,
    );

    return res.map((r) => r.path);
  }

  public find(args: Prisma.MenuFindManyArgs) {
    return this.db.menu.findMany(args);
  }

  public findFirst(args: Prisma.MenuFindFirstArgs) {
    return this.db.menu.findFirst(args);
  }

  public findFirstWithChildren(args: Prisma.MenuFindFirstArgs) {
    return this.db.menu.findFirst({
      ...args,
      relationLoadStrategy: 'join',
      include: {
        children: true,
      },
    });
  }
}
