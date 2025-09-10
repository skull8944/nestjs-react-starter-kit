import { Injectable, Scope } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { BaseRepository, TransactionScope } from '../../../core/database';

@Injectable({ scope: Scope.REQUEST })
export class JobHistoryRepository extends BaseRepository<'jobHistory'> {
  constructor(protected readonly ts: TransactionScope) {
    super(ts);
  }

  public async create(data: Prisma.JobHistoryCreateInput) {
    return this.db.jobHistory.create({ data });
  }

  public async edit(id: number, data: Prisma.JobHistoryUpdateInput) {
    return this.db.jobHistory.update({
      where: { id },
      data,
    });
  }
}
