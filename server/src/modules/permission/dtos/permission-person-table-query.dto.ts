import type { Account, Role } from '@prisma/client';

import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class PermissionPersonTableQueryDto {
  constructor(init: PermissionPersonTableQueryDto) {
    Object.assign(this, init);
  }

  /**
   * fuzzy search (name/emplid)
   * @from Account['name'] | Account['emplid']
   */
  @IsString()
  @IsOptional()
  keyword?: string;

  @IsString({ each: true })
  @IsOptional()
  roles?: Role['id'][];

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
