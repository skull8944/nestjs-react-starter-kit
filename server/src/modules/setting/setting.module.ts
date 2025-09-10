import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../core/database';

import { SettingRepository } from './setting.repository';
import { SettingService } from './setting.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [SettingService, SettingRepository],
  exports: [SettingService],
})
export class SettingModule {}
