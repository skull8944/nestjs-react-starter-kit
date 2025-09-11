import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class JobScheduleRepository {
  constructor(private readonly db: PrismaService) {}

  public find(args: Prisma.JobScheduleFindManyArgs) {
    return this.db.jobSchedule.findMany(args);
  }

  public edit(id: string, data: Prisma.JobScheduleUpdateInput) {
    return this.db.jobSchedule.update({
      where: { id },
      data,
    });
  }
}
