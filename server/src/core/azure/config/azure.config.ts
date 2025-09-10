import { registerAs } from '@nestjs/config';

import { IsString } from 'class-validator';

import validateConfig from '../../../utils/validate-config';

import type { AzureConfig } from './azure.config.type';

class AzureConfigSchema implements AzureConfig {
  @IsString()
  public azureStorageDomainUrl!: string;

  @IsString()
  public azureStorageConnectionString!: string;

  @IsString()
  public azureStorageDefaultShareName!: string;
}

export default registerAs<AzureConfig>('azure', () => {
  validateConfig(process.env, AzureConfigSchema);

  return {
    azureStorageDomainUrl: process.env.azureStorageDomainUrl,
    azureStorageConnectionString: process.env.azureStorageConnectionString,
    azureStorageDefaultShareName: process.env.azureStorageDefaultShareName,
  };
});
