import { registerAs } from '@nestjs/config';

import { IsString } from 'class-validator';

import validateConfig from '@/utils/validate-config';

import type { DatabaseConfig } from './database.config.type';

export class DatabaseConfigSchema implements DatabaseConfig {
  @IsString()
  dbConnectionString!: string;
}

export default registerAs<DatabaseConfig>('database', () => {
  validateConfig(process.env, DatabaseConfigSchema);

  return {
    dbConnectionString: process.env.dbConnectionString,
  };
});
