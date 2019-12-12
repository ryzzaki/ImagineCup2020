import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import appConfig from './config/configuration.config';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  if (appConfig.serverSettings.serverMode === 'development') {
    app.enableCors({
      credentials: true,
      origin: ['http://localhost:8080', 'http://localhost:8000'],
    });
    logger.log('Enabling CORS in dev mode');
  }

  try {
    app.use(cookieParser(appConfig.serverSettings.cookieSecret), helmet());
    logger.log('Cookie Parser initialized with a secret');
    logger.log('Helmet initialized');
  } catch (error) {
    logger.error(
      `Failed to initialize Cookie Parser or Helmet on error ${error}`,
    );
    throw new InternalServerErrorException(
      `Failed to initialize Cookie Parser or Helmet on error ${error}`,
    );
  }

  await app.listen(appConfig.serverSettings.port);
  logger.log(`Server listening on port: ${appConfig.serverSettings.port}`);
}
bootstrap();
