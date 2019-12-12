import { RedisModuleOptions } from 'nestjs-redis';
import appConfig from './configuration.config';

export const redisModuleConfig: RedisModuleOptions = {
  host: appConfig.redisModuleSettings.host,
  port: appConfig.redisModuleSettings.port,
  db: appConfig.redisModuleSettings.db,
  password: appConfig.redisModuleSettings.password,
};
