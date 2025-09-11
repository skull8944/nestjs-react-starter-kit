import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class JobHistoryRepository {
  constructor(private readonly db: PrismaService) {}

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
