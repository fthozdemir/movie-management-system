import { Module } from "@nestjs/common";
import { AppController } from "@/app/app.controller";
import { AppService } from "@/app/app.service";
import { ConfigsModule } from "../config/configs.module";
import { AuthModule } from "@/auth";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "@/auth/guards/roles.guard";
import {
  PrismaModule,
  loggingMiddleware,
  createUserMiddleware,
  removePasswordMiddleware,
} from "@/providers/prisma";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    /* This module loads config from environment and loads into the app  */
    ConfigsModule,
    AuthModule,
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware(),
          createUserMiddleware(),
          removePasswordMiddleware(),
        ],
      },
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
      global: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD, // Apply the RolesGuard globally
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
