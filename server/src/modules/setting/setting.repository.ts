import { Injectable, Scope } from '@nestjs/common';

import { BaseRepository, TransactionScope } from '../../core/database';

import { SettingKey } from './setting-key';

@Injectable({ scope: Scope.REQUEST })
export class SettingRepository extends BaseRepository {
  constructor(ts: TransactionScope) {
    super(ts);
  }

  public findFirstSettingByKey(key: SettingKey | keyof typeof SettingKey) {
    return this.db.setting.findFirst({
      where: {
        key: key as unknown as string,
        isEnabled: true,
      },
    });
  }
}
