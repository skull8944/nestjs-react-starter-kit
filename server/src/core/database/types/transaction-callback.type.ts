import type { TableName } from './table-name.type';
import type { TransactionManager } from './transaction-manager.type';

export type TransactionCallback<T, TTableName extends TableName = TableName> = (
  manager: TransactionManager<TTableName>,
) => Promise<T>;
