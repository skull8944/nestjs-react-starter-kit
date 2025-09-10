import { Injectable, Scope } from '@nestjs/common';

import type { SettingKey } from './setting-key';
import { SettingRepository } from './setting.repository';

@Injectable({ scope: Scope.REQUEST })
export class SettingService {
  constructor(private readonly repo: SettingRepository) {}

  public async getSettingByKey(key: SettingKey | keyof typeof SettingKey) {
    return this.repo.findFirstSettingByKey(key);
  }
}
