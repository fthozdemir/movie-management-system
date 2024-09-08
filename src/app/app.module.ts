import { Module } from "@nestjs/common";
import { AppController } from "@/app/app.controller";
import { AppService } from "@/app/app.service";
import { ConfigsModule } from "../config/configs.module";
import { AuthModule } from "@modules/auth";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard, AuthGuard } from "@modules/auth/guards";
import {
  PrismaModule,
  loggingMiddleware,
  createUserMiddleware,
  removePasswordMiddleware,
} from "@providers/prisma";
import { JwtModule } from "@nestjs/jwt";
import { MovieModule } from "@modules/movie/movie.module";
import { TicketModule } from "@/modules/ticket/ticket.module";

@Module({
  imports: [
    /* This module loads config from environment and loads into the app  */
    ConfigsModule,
    AuthModule,
    MovieModule,
    TicketModule,
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
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD, // Apply the RolesGuard globally
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
