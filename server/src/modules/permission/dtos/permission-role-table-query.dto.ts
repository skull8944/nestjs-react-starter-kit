import type { Menu, Role } from '@prisma/client';

import { IsOptional, IsString } from 'class-validator';

export class PermissionRoleTableQueryDto {
  constructor(init: PermissionRoleTableQueryDto) {
    Object.assign(this, init);
  }

  // fuzzy search (name)
  @IsString()
  @IsOptional()
  keyword?: Role['name'];

  // uuid array
  @IsString({ each: true })
  @IsOptional()
  permissions?: Menu['id'][];
}
