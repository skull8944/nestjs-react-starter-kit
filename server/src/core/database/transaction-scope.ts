import { Injectable, Logger, Scope } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { randomUUID } from 'crypto';

import { PrismaService } from './prisma.service';
import type {
  TableName,
  TransactionCallback,
  TransactionCallbackWithIsolationLevel,
  TransactionManager,
} from './types';

/**
 * ! TTableName: whether to restrict the allowed table names (for clean architecture)
 */
// ! must be request-scoped
@Injectable({ scope: Scope.REQUEST })
export class TransactionScope<TTableName extends TableName = TableName> {
  private readonly logger = new Logger(TransactionScope.name);

  private id: string | null = null;

  protected manager: TransactionManager<TTableName> | null = null;

  constructor(protected readonly prisma: PrismaService) {}

  public get db(): TransactionManager<TTableName> {
    return this.manager ?? this.prisma;
  }

  public transaction<T>(callback: TransactionCallback<T, TTableName>): Promise<T>;
  public transaction<T>(
    isolationLevel: `${Prisma.TransactionIsolationLevel}`,
    callback: TransactionCallback<T, TTableName>,
  ): Promise<T>;
  public async transaction<T>(
    isolationLevelOrCallback:
      | `${Prisma.TransactionIsolationLevel}`
      | TransactionCallback<T, TTableName>,
    callback?: TransactionCallback<T, TTableName>,
  ) {
    const isolationLevel =
      typeof isolationLevelOrCallback === 'function'
        ? Prisma.TransactionIsolationLevel.ReadCommitted
        : Prisma.TransactionIsolationLevel[isolationLevelOrCallback];

    const cb: TransactionCallbackWithIsolationLevel<T, TTableName> =
      typeof isolationLevelOrCallback === 'function' ? isolationLevelOrCallback : callback!;

    if (this.manager && this.id) {
      this.logger.log(`Transaction ${this.id} reused`);

      return cb(this.manager);
    }

    try {
      this.id = randomUUID();
      this.logger.log(`Transaction ${this.id} started with isolation level: ${isolationLevel}`);

      return await this.prisma.$transaction(
        async (manager) => {
          this.manager = manager;

          return cb(manager, isolationLevel);
        },
        { isolationLevel },
      );
    } catch (err) {
      this.logger.error(`Transaction ${this.id} failed`, err);

      throw err;
    } finally {
      this.manager = null;

      this.logger.log(`Transaction ${this.id} ended`);

      this.id = null;
    }
  }
}
