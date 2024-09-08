import { Module } from "@nestjs/common";
import { AuthService } from "@modules/auth/domain/services/auth.service";
import { AuthController } from "@modules/auth/application/auth.controller";
import { PassportModule } from "@nestjs/passport";
import { UserRepository } from "@modules/auth/infrastructure/repositories/user.repository";
@Module({
  imports: [PassportModule],
  providers: [AuthService, UserRepository],
  controllers: [AuthController],
})
export class AuthModule {}
