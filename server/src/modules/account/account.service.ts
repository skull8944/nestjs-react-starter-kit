import { Injectable, Scope } from '@nestjs/common';

import type { Prisma } from '@prisma/client';

import { AccountRepository } from './account.repository';

@Injectable({ scope: Scope.REQUEST })
export class AccountService {
  constructor(private readonly repo: AccountRepository) {}

  public findFirst(args: Prisma.AccountFindFirstArgs) {
    return this.repo.findFirst(args);
  }

  public findFirstWithRole(args: Prisma.AccountFindFirstArgs) {
    return this.repo.findFirstWithRole(args);
  }

  public find(args?: Prisma.AccountFindManyArgs) {
    return this.repo.find(args);
  }

  public findWithRole(args: Prisma.AccountFindManyArgs) {
    return this.repo.findWithRole(args);
  }

  public create(data: Prisma.AccountCreateInput) {
    return this.repo.create({ data });
  }

  public edit(args: Prisma.AccountUpdateArgs) {
    return this.repo.edit(args);
  }

  public count(args: Prisma.AccountCountArgs) {
    return this.repo.count(args);
  }
}
