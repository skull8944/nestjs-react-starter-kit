import type { Account } from '@prisma/client';

type AccountInfo = Omit<
  Account,
  'disabled' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
>;

export class LoginResponseDto implements AccountInfo {
  constructor(init: LoginResponseDto) {
    Object.assign(this, init);
  }

  emplid!: string;

  name!: string;

  email!: string;
}
