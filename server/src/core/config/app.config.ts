import { registerAs } from '@nestjs/config';

import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

import validateConfig from '../../utils/validate-config';

import type { AppConfig } from './app-config.type';
import { NODE_ENV, type NodeEnv } from './types';

export class AppConfigSchema implements AppConfig {
  @IsIn(NODE_ENV)
  NODE_ENV!: NodeEnv;

  @IsNumberString()
  APP_PORT!: string | number;

  @IsString()
  @IsOptional()
  appInsightsConnectionString?: string;

  @IsIn(['web', 'job'])
  SERVER_TYPE!: 'web' | 'job';
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, AppConfigSchema);

  return {
    NODE_ENV: process.env.NODE_ENV,
    APP_PORT: process.env.APP_PORT,
    appInsightsConnectionString: process.env.appInsightsConnectionString,
    SERVER_TYPE: process.env.SERVER_TYPE,
  };
});
