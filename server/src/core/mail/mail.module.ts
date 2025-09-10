import { Module } from '@nestjs/common';

import { SettingModule } from '../../modules/setting/setting.module';

import { MailService } from './mail.service';
import { NodemailerModule } from './nodemailer.module';

@Module({
  imports: [NodemailerModule, SettingModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
