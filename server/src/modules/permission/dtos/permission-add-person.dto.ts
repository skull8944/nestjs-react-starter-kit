import type { Account, Role } from '@prisma/client';

import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class PermissionAddPersonDto {
  constructor(init: PermissionAddPersonDto) {
    Object.assign(this, init);
  }

  @IsString()
  emplid!: Account['emplid'];

  @IsString()
  name!: Account['name'];

  @IsEmail()
  email!: Account['email'];

  @IsString({ each: true })
  roles!: Role['id'][];

  @IsBoolean()
  active!: boolean;
}
