import { IsString } from 'class-validator';

export class PermissionAddRoleDto {
  constructor(init: PermissionAddRoleDto) {
    Object.assign(this, init);
  }

  @IsString()
  name!: string;

  @IsString({ each: true })
  views!: string[];

  @IsString({ each: true })
  admins!: string[];
}
