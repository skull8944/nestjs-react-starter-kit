import type { Account, Role } from '@prisma/client';

import { IsBoolean, IsString } from 'class-validator';

export class PermissionEditPersonDto {
  constructor(init: PermissionEditPersonDto) {
    Object.assign(this, init);
  }

  @IsString()
  emplid!: Account['emplid'];

  @IsString({ each: true })
  roles!: Role['id'][];

  @IsBoolean()
  active!: boolean;
}
