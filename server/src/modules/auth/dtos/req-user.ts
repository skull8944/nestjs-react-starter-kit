import type { Account } from '@prisma/client';

type AccountInfo = Omit<Account, 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>;

export class ReqUser implements AccountInfo {
  constructor(init: AccountInfo, getPermissions: ReqUser['_getPermissions']) {
    this._getPermissions = getPermissions;
    Object.assign(this, init);
  }

  name!: string;

  emplid!: string;

  email!: string;

  disabled!: boolean;

  site!: string;

  private _permissions: string[] = [];

  private _getPermissions!: () => Promise<string[]>;

  public getPermissions(): Promise<string[]> {
    return this._permissions.length ? Promise.resolve(this._permissions) : this._getPermissions();
  }
}
