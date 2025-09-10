import type { NodeEnv } from './types/node-env.type';

export type AppConfig = Readonly<{
  NODE_ENV: NodeEnv;

  APP_PORT: string | number;

  appInsightsConnectionString?: string;

  SERVER_TYPE: 'web' | 'job';
}>;
