import type { Prisma } from '@prisma/client';

export type TableName = Uncapitalize<Prisma.ModelName>;
