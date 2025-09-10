import type { Role } from '@prisma/client';

export class PermissionRoleTableDto {
  constructor(init: PermissionRoleTableDto) {
    Object.assign(this, init);
  }

  id!: Role['id'];

  name!: Role['name'];
}
