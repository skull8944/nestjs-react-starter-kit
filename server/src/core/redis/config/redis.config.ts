import { registerAs } from '@nestjs/config';

import { IsNumberString, IsString } from 'class-validator';

import validateConfig from '@/utils/validate-config';

export type RedisConfig = {
  host: string;
  port: number | string;
  password: string;
};

class RedisConfigSchema {
  @IsString()
  REDIS_HOST!: string;

  @IsNumberString()
  REDIS_PORT!: number | string;

  @IsString()
  redisPassword!: string;
}

export default registerAs<RedisConfig>('redis', () => {
  validateConfig(process.env, RedisConfigSchema);

  return {
    host: process.env.REDIS_HOST!,
    port: +process.env.REDIS_PORT!,
    password: process.env.redisPassword!,
  };
});
