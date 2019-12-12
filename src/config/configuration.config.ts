import * as dotenv from 'dotenv';
import { AppConfigInterface } from '../interfaces/appconfig.interface';

dotenv.config();

const appConfig: AppConfigInterface = {
  serverSettings: {
    serverMode: String(process.env.NODE_ENV),
    port: Number(process.env.PORT),
    cookieSecret: String(process.env.COOKIE_SECRET),
    refreshTokenAge: Number(process.env.REFRESH_TOKEN_AGE),
  },
  typeOrmSettings: {
    host: String(process.env.DB_HOST),
    port: Number(process.env.DB_PORT),
    name: String(process.env.DB_NAME),
    username: String(process.env.DB_USERNAME),
    password: String(process.env.DB_PASSWORD),
    synchronize: Boolean(process.env.DB_SYNCHRONIZE),
  },
  redisModuleSettings: {
    host: String(process.env.RDS_HOST),
    port: Number(process.env.RDS_PORT),
    db: Number(process.env.RDS_DB),
    password: String(process.env.RDS_PASSWORD),
  },
  jwtSettings: {
    accessPublicKey: String(process.env.ACCESS_JWT_PUBLIC),
    accessPrivateKey: String(process.env.ACCESS_JWT_PRIVATE),
    refreshPublicKey: String(process.env.REFRESH_JWT_PUBLIC),
    refreshPrivateKey: String(process.env.REFRESH_JWT_PRIVATE),
    algorithm: String(process.env.JWT_HASHING_ALGORITHM),
  },
  authProviderSettings: {
    googleId: String(process.env.GOOGLE_ID),
    googleSecret: String(process.env.GOOGLE_SECRET),
    facebookId: String(process.env.FACEBOOK_ID),
    facebookSecret: String(process.env.FACEBOOK_SECRET),
  },
  mailerSettings: {
    password: String(process.env.EMAIL_PASSWORD),
  },
};

export default appConfig;
