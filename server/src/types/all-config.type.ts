import type { AzureConfig } from '../core/azure/config/azure.config.type';
import type { AppConfig } from '../core/config/app-config.type';
import type { DatabaseConfig } from '../core/database/config/database.config.type';

import type { MsalConfig } from '../modules/auth/config/msal.config';

export type AllConfig = Readonly<{
  app: AppConfig;
  database: DatabaseConfig;
  azure: AzureConfig;
  msal: MsalConfig;
}>;
