import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import appConfig from "./parts/app.config";
import { validateConfig } from "./config-validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
      validate: validateConfig, // config validator
    }),
  ],
})
export class ConfigsModule {}
