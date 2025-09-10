import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as Handlebars from 'handlebars';
import { pick } from 'lodash';
import { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import { SettingService } from '../../modules/setting/setting.service';
import { SettingKey } from '@/modules/setting/setting-key';

import type { AllConfig } from '@/types/all-config.type';

@Injectable()
export class MailService {
  static readonly MAILER_DI_NAME = 'MAILER';

  private readonly logger = new Logger(MailService.name);

  constructor(
    @Inject(MailService.MAILER_DI_NAME)
    private readonly mailer: Transporter,
    private readonly configService: ConfigService<AllConfig>,
    private readonly settingService: SettingService,
  ) {}

  /**
   * 發送郵件
   * @param options 郵件選項
   * @returns 發送結果
   */
  async sendMail(options: Mail.Options): Promise<void> {
    try {
      const mailSetting = await this.settingService.getSettingByKey(SettingKey.Mail);
      const isMailEnabled =
        (
          mailSetting?.value1 as { isMailEnabled: boolean | string } | undefined
        )?.isMailEnabled?.toString() === 'true';

      if (!isMailEnabled) {
        this.logger.warn('Mail sending is disabled.');

        return;
      }

      let mailOptions = {
        ...options,
        from: 'NestJS Starter<nestjs_starter@google.com',
        subject: this.formatSubjectWithEnv(options.subject ?? ''),
      };

      const NODE_ENV = this.configService.get('app.NODE_ENV', { infer: true })!;
      const isNotPrd = !(NODE_ENV === 'prd');
      if (isNotPrd && mailSetting?.value1) {
        const mailValue = mailSetting.value1 as { recipient?: string[] };
        mailOptions = {
          ...mailOptions,
          to: mailValue.recipient,
        };
      }

      console.table(pick(mailOptions, 'subject', 'to', 'cc', 'bcc'));

      await this.mailer.sendMail(mailOptions);
    } catch (error) {
      this.logger.error(`sendMail error: ${error}`);
      throw new InternalServerErrorException(`sendMail error: ${error}`);
    }
  }

  private formatSubjectWithEnv(subject: string): string {
    const NODE_ENV = this.configService.get('app.NODE_ENV', { infer: true })!;
    const prefix: string = NODE_ENV === 'prd' ? '' : `${NODE_ENV?.toUpperCase()}-`;

    return `${prefix}${subject}`;
  }

  /**
   * 將資料填入模板
   * @param template 模板內容
   * @param data 要填入的資料
   * @returns 填入資料後的內容
   */
  private render<T>(template: string, data: T): string {
    try {
      const compiledTemplate = Handlebars.compile(template);

      return compiledTemplate(data);
    } catch (error) {
      this.logger.error(`Failed to compile email template`, error);
      throw new InternalServerErrorException(`Unable to compile email template`);
    }
  }

  async sendMailWithTemplateBuffer<T>(
    templateBuffer: string,
    data: T,
    mailOptions: Omit<Mail.Options, 'html'>,
  ): Promise<void> {
    const htmlContent = this.render(templateBuffer, data);

    return this.sendMail({ ...mailOptions, html: htmlContent });
  }
}
