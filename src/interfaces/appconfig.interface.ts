export interface AppConfigInterface {
  serverSettings: {
    serverMode: string,
    port: number,
    cookieSecret: string,
    refreshTokenAge: number,
  };
  typeOrmSettings: {
    host: string,
    port: number,
    name: string,
    username: string,
    password: string,
    synchronize: boolean,
  };
  redisModuleSettings: {
    host: string,
    port: number,
    db: number,
    password: string,
  };
  jwtSettings: {
    accessPublicKey: string,
    accessPrivateKey: string,
    refreshPublicKey: string,
    refreshPrivateKey: string,
    algorithm: string,
  };
  authProviderSettings: {
    googleId: string,
    googleSecret: string,
    facebookId: string,
    facebookSecret: string,
  };
  mailerSettings: {
    password: string,
  };
}
