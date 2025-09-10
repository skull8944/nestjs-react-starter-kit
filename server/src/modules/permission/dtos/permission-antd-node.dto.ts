import type { VwMenu } from '@prisma/client';

export class PermissionAntdNodeDto {
  constructor(init: PermissionAntdNodeDto) {
    Object.assign(this, init);
  }

  id!: string;

  label!: string;

  title!: string;

  key!: number | string;

  disabled!: boolean;

  type!: VwMenu['type'];

  children?: PermissionAntdNodeDto[];
}
