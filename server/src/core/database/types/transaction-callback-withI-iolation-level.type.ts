import { Prisma } from '@prisma/client';

import type { TableName } from './table-name.type';
import type { TransactionManager } from './transaction-manager.type';

export type TransactionCallbackWithIsolationLevel<T, TTableName extends TableName = TableName> = (
  manager: TransactionManager<TTableName>,
  isolationLevel?: Prisma.TransactionIsolationLevel,
) => Promise<T>;
