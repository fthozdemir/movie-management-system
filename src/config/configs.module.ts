import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import appConfig from "./parts/app.config";
import { validateConfig } from "./config-validation";
import swaggerConfig from "./parts/swagger.config";
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, swaggerConfig],
      isGlobal: true,
      validate: validateConfig, // config validator
    }),
  ],
})
export class ConfigsModule {}
