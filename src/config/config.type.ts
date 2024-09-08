export interface IAppConfig {
  port: number | string;
  baseUrl: string;
  env: string;
  // eslint-disable-next-line global-require,@typescript-eslint/no-var-requires
  version: string | number;
}

export enum EConfigKey {
  App = "APP",
  Db = "DB",
  Swagger = "SW",
}

export enum EEnvironment {
  Local = "local",
  Development = "development",
  Staging = "staging",
  Production = "production",
  Testing = "test",
}
