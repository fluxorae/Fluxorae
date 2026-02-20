import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const nodeEnv = config.get<string>('nodeEnv') ?? 'development';
  const apiPrefix = config.get<string>('apiPrefix') ?? 'api';
  const corsOrigins = config.get<string[]>('corsOrigins') ?? [];
  const trustProxy = config.get<boolean | number | string>('trustProxy') ?? 1;
  const bodySizeLimit = config.get<string>('bodySizeLimit') ?? '1mb';
  const rateLimitWindowMs = config.get<number>('rateLimitWindowMs') ?? 60000;
  const rateLimitMax = config.get<number>('rateLimitMax') ?? 120;

  app.set('trust proxy', trustProxy);
  app.use(
    helmet({
      contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
      crossOriginResourcePolicy: false,
    }),
  );
  app.use(compression());
  app.use(json({ limit: bodySizeLimit }));
  app.use(urlencoded({ limit: bodySizeLimit, extended: true }));
  app.use(
    rateLimit({
      windowMs: rateLimitWindowMs,
      max: rateLimitMax,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      skip: (req) => req.path.endsWith('/health'),
    }),
  );
  app.enableCors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || corsOrigins.length === 0 || corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  });

  app.setGlobalPrefix(apiPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableShutdownHooks();

  const port = config.get<number>('port') ?? 3000;
  await app.listen(port, '0.0.0.0');
  logger.log(`Fluxorae API listening on http://0.0.0.0:${port}/${apiPrefix}`);
}

bootstrap();
