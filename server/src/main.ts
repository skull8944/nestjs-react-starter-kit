import 'dotenv/config';

import { type INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import cors from 'cors';

import { AuthGuard } from './modules/auth/auth.guard';

import { AppModule } from './app.module';
import type { AllConfig } from './types/all-config.type';

let app: INestApplication;

async function bootstrap() {
  // console.log(process.env);

  app = await NestFactory.create(AppModule);
  const prefix = 'api';
  const configService = app.get<ConfigService<AllConfig>>(ConfigService);
  const NODE_ENV = configService.get('app.NODE_ENV', { infer: true });
  Logger.log(`NODE_ENV = ${NODE_ENV}`);

  const whitelist = ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:3001'];

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(prefix);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || whitelist.includes(origin)) {
          return callback(null, true);
        }

        return callback(null, false);
      },
      credentials: true,
    }),
  );

  if (process.env.NODE_ENV !== 'prd') {
    const options = new DocumentBuilder()
      .setTitle(`NestJS Starter`)
      .setVersion('1.0')
      .addBearerAuth()
      .addSecurityRequirements('bearer')
      .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('api-docs', app, document, {
      swaggerOptions: {
        tagsSorter: 'alpha',
      },
    });
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalGuards(await app.resolve(AuthGuard));

  await app.listen(process.env.APP_PORT || 8080);
}

bootstrap();

export { app };
