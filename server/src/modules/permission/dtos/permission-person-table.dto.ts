import type { Account, Role } from '@prisma/client';

export class PermissionPersonTableDto {
  constructor(init: PermissionPersonTableDto) {
    Object.assign(this, init);
  }

  active!: boolean;

  name!: Account['name'];

  emplid!: Account['emplid'];

  roles!: {
    id: Role['id'];
    name: Role['name'];
  }[];
}
