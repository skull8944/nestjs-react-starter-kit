import { Injectable, Scope } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { BaseRepository, TransactionScope } from '../../../core/database';

@Injectable({ scope: Scope.REQUEST })
export class JobScheduleRepository extends BaseRepository<'jobSchedule'> {
  constructor(protected readonly ts: TransactionScope) {
    super(ts);
  }

  public find(args: Prisma.JobScheduleFindManyArgs) {
    return this.db.jobSchedule.findMany(args);
  }

  public findById(id: string) {
    return this.db.jobSchedule.findUnique({
      where: { id },
    });
  }

  public edit(id: string, data: Prisma.JobScheduleUpdateInput) {
    return this.db.jobSchedule.update({
      where: { id },
      data,
    });
  }
}
