import { Injectable, Scope } from '@nestjs/common';

import type { Prisma } from '@prisma/client';

import { BaseRepository } from '../../../core/database/base-repository';
import { TransactionScope } from '../../../core/database/transaction-scope';

@Injectable({ scope: Scope.REQUEST })
export class RoleRepository extends BaseRepository<'role'> {
  constructor(protected readonly ts: TransactionScope) {
    super(ts);
  }

  public findFirst(args: Prisma.RoleFindFirstArgs) {
    return this.db.role.findFirst(args);
  }

  public findFirstWithMenu(args: Prisma.RoleFindFirstArgs) {
    return this.db.role.findFirst({
      ...args,
      relationLoadStrategy: 'join',
      include: {
        menus: {
          include: {
            menu: true,
          },
        },
      },
    });
  }

  public find(args: Prisma.RoleFindManyArgs) {
    return this.db.role.findMany(args);
  }

  public count(args: Prisma.RoleCountArgs) {
    return this.db.role.count(args);
  }

  public create(data: Prisma.RoleCreateArgs['data']) {
    return this.db.role.create({ data });
  }

  public edit(args: Prisma.RoleUpdateArgs) {
    return this.db.role.update(args);
  }

  public delete(args: Prisma.RoleDeleteArgs) {
    return this.db.role.delete(args);
  }
}
