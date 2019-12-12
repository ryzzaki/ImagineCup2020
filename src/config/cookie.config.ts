import appConfig from './configuration.config';

export const cookieConfig = {
  maxAge: (appConfig.serverSettings.refreshTokenAge * 1000),
  secure: false,
  signed: true,
  httpOnly: false,
};
