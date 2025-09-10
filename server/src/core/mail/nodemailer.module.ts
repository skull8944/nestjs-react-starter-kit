import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';

import { MailService } from './mail.service';

@Global()
@Module({
  providers: [
    {
      provide: MailService.MAILER_DI_NAME,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('mailHost');
        const port = 25;

        return nodemailer.createTransport({ host, port });
      },
    },
  ],
  exports: [MailService.MAILER_DI_NAME],
})
export class NodemailerModule {}
