import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';

import azureConfig from './core/azure/config/azure.config';
import appConfig from './core/config/app.config';
import databaseConfig from './core/database/config/database.config';
import { DatabaseModule } from './core/database/database.module';

import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import msalConfig from './modules/auth/config/msal.config';
import { PermissionModule } from './modules/permission/permission.module';
import { SettingModule } from './modules/setting/setting.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import ApiLoggerMiddleware from './middleware/api-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, azureConfig, msalConfig],
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
