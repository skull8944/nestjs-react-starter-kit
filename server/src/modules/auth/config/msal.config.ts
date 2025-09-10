import { registerAs } from '@nestjs/config';

import { IsString } from 'class-validator';

import validateConfig from '../../../utils/validate-config';

export type MsalConfig = {
  AAD_CLIENT_ID: string;

  AAD_TENANT_ID: string;

  aadClientSecret: string;
};

export class MsalConfigSchema implements MsalConfig {
  @IsString()
  AAD_CLIENT_ID!: string;

  @IsString()
  AAD_TENANT_ID!: string;

  @IsString()
  aadClientSecret!: string;
}

export default registerAs<MsalConfig>('msal', () => {
  validateConfig(process.env, MsalConfigSchema);

  return {
    AAD_CLIENT_ID: process.env.AAD_CLIENT_ID,
    AAD_TENANT_ID: process.env.AAD_TENANT_ID,
    aadClientSecret: process.env.aadClientSecret,
  };
});
