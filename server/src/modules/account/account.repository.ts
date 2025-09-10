import { Injectable, Scope } from '@nestjs/common';

import type { Prisma } from '@prisma/client';

import { BaseRepository, TransactionScope } from '../../core/database';

@Injectable({ scope: Scope.REQUEST })
export class AccountRepository extends BaseRepository<'account'> {
  constructor(protected readonly ts: TransactionScope) {
    super(ts);
  }

  public findFirst(args: Prisma.AccountFindFirstArgs) {
    return this.db.account.findFirst(args);
  }

  public findFirstWithRole(args: Prisma.AccountFindFirstArgs) {
    return this.db.account.findFirst({
      ...args,
      relationLoadStrategy: 'join',
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  public find(args?: Prisma.AccountFindManyArgs) {
    return this.db.account.findMany(args);
  }

  public findWithRole(args: Prisma.AccountFindManyArgs) {
    return this.db.account.findMany({
      ...args,
      relationLoadStrategy: 'join',
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  public create(args: Prisma.AccountCreateArgs) {
    return this.db.account.create(args);
  }

  public edit(args: Prisma.AccountUpdateArgs) {
    return this.db.account.update(args);
  }

  public count(args: Prisma.AccountCountArgs) {
    return this.db.account.count(args);
  }

  public update(args: Prisma.AccountUpdateArgs) {
    return this.db.account.update(args);
  }
}
