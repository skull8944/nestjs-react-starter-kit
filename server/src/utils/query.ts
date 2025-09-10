import { Prisma } from '@prisma/client';

import type { Pagination, Sorter } from './pagination';

export class QueryUtil {
  static getPaginationOffset(pagination: Pagination): number {
    // ! current starts from 1
    return (pagination.current - 1) * pagination.pageSize;
  }

  static getOrderBy<TRecord extends Record<string, unknown> = Record<string, unknown>>(
    sorters: Sorter[],
    mapper: Record<string, keyof TRecord> = {},
  ): Partial<Record<keyof TRecord, Prisma.SortOrder>> {
    return sorters.reduce(
      (acc, sorter) => {
        const recordKey = (mapper[sorter.field] ?? sorter.field) as keyof TRecord;
        const order: Prisma.SortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';

        acc[recordKey] = order;

        return acc;
      },
      {} as Partial<Record<keyof TRecord, Prisma.SortOrder>>,
    );
  }
}
