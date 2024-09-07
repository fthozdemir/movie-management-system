import { EConfigKey, EEnvironment } from "@/config/config.type";
import { registerAs } from "@nestjs/config";

export default registerAs(EConfigKey.App, () => ({
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  env: process.env.NODE_ENV || EEnvironment.Development,
  // eslint-disable-next-line global-require,@typescript-eslint/no-var-requires
}));
