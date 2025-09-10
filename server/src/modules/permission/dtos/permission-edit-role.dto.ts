import type { Menu, Role } from '@prisma/client';

import { IsString } from 'class-validator';

export class PermissionEditRoleDto {
  constructor(init: PermissionEditRoleDto) {
    Object.assign(this, init);
  }

  @IsString()
  id!: Role['id'];

  @IsString({ each: true })
  views!: Menu['id'][];

  @IsString({ each: true })
  admins!: Menu['id'][];
}
