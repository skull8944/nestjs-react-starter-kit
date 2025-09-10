import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, ModuleMetadata, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';

import azureConfig from './core/azure/config/azure.config';
import appConfig from './core/config/app.config';
import databaseConfig from './core/database/config/database.config';
import { DatabaseModule } from './core/database/database.module';
import redisConfig from './core/redis/config/redis.config';

import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import msalConfig from './modules/auth/config/msal.config';
import jobConfig from './modules/job/config/job.config';
import { PermissionModule } from './modules/permission/permission.module';
import { SettingModule } from './modules/setting/setting.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import ApiLoggerMiddleware from './middleware/api-logger.middleware';
import type { AllConfig } from './types/all-config.type';

const jobModules: ModuleMetadata['imports'] = [];
if (process.env.SERVER_TYPE === 'job') {
  import('@nestjs/bullmq').then((m) => {
    jobModules.push(
      m.BullModule.forRootAsync({
        useFactory: (configService: ConfigService<AllConfig>) => ({
          connection: {
            host: configService.get('redis.host', { infer: true }),
            port: configService.get('redis.port', { infer: true }),
            password: configService.get('redis.password', { infer: true }),
            // 增加前綴，避免與其他應用程序衝突
            prefix: configService.get('job.redisPrefix', { infer: true }),
          },
          // 增加全局默認設定
          defaultJobOptions: {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 1000,
            },
            removeOnComplete: { count: 1000 }, // 保留最近1000個完成的作業記錄
            removeOnFail: { count: 5000 }, // 保留最近5000個失敗的作業記錄
          },
        }),
        inject: [ConfigService],
      }),
    );

    // 增加隊列配置
    jobModules.push(
      m.BullModule.registerQueue({
        name: 'job',
      }),
    );
  });

  import('./modules/job/job.module').then((m) => jobModules.push(m.JobModule));
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, azureConfig, msalConfig, redisConfig, jobConfig],
    }),
    HttpModule.register({
      timeout: 60000,
      maxRedirects: 5,
      global: true,
    }),
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({
      delimiter: '.',
      newListener: false,
      removeListener: false,
      wildcard: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    DatabaseModule,
    TerminusModule,
    AuthModule,
    SettingModule,
    PermissionModule,
    AccountModule,
    ...jobModules,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [HttpModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiLoggerMiddleware).forRoutes('*');
  }
}
