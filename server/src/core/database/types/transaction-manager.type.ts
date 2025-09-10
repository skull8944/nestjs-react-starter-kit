import type { PrismaService } from '../prisma.service';

import type { TableName } from './table-name.type';

export type TransactionManager<TTableName extends TableName = TableName> = Pick<
  Parameters<Parameters<typeof PrismaService.prototype.$transaction>[0]>[0],
  TTableName | '$executeRaw' | '$executeRawUnsafe' | '$queryRaw' | '$queryRawUnsafe'
>;
