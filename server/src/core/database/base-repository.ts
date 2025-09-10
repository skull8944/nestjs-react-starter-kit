import { Prisma } from '@prisma/client';

import { TransactionScope } from './transaction-scope';
import type { TableName, TransactionCallback, TransactionManager } from './types';

export abstract class BaseRepository<TTableRestriction extends TableName = TableName> {
  constructor(protected readonly ts: TransactionScope) {}

  // ! restrict usage of PrismaClient to only the methods that are allowed
  protected get db(): TransactionManager<TTableRestriction> {
    return this.ts.db;
  }

  public transaction<T>(callback: TransactionCallback<T>): Promise<T>;
  public transaction<T>(
    isolationLevel: `${Prisma.TransactionIsolationLevel}`,
    callback: TransactionCallback<T>,
  ): Promise<T>;
  public transaction<T>(
    isolationLevelOrCallback:
      | `${Prisma.TransactionIsolationLevel}`
      | ((m: TransactionManager) => Promise<T>),
    callback?: TransactionCallback<T>,
  ) {
    if (typeof isolationLevelOrCallback === 'function') {
      return this.ts.transaction(isolationLevelOrCallback);
    }

    return this.ts.transaction(
      Prisma.TransactionIsolationLevel[isolationLevelOrCallback],
      callback!,
    );
  }
}
