import appConfig from '../../config/configuration.config';
import { InternalServerErrorException } from '@nestjs/common';

export enum UrlEnums {
  AUTH_API_URL = getServerModeBasedApiUrl(appConfig.serverSettings.serverMode),
  REDIRECT_URL = getServerModeBasedRedirectUrl(
    appConfig.serverSettings.serverMode,
  ),
}

function getServerModeBasedApiUrl(serverMode: string): any {
  switch (serverMode) {
    case 'development':
      return 'http://localhost:3000';
    case 'staging':
      return 'https://staging.projecthero.co.uk';
    case 'production':
      return 'https://projecthero.co.uk';
    default:
      throw new InternalServerErrorException(
        `Server mode ${serverMode} for AUTH_API_URL is not supported`,
      );
  }
}

function getServerModeBasedRedirectUrl(serverMode: string): any {
  switch (serverMode) {
    case 'development':
      return 'http://localhost:8000';
    case 'staging':
      return 'https://staging.projecthero.co.uk';
    case 'production':
      return 'https://projecthero.co.uk';
    default:
      throw new InternalServerErrorException(
        `Server mode ${serverMode} for REDIRECT_URL is not supported`,
      );
  }
}
