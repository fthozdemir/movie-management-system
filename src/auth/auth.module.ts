import { Module } from "@nestjs/common";
import { AuthService } from "@/auth/domain/services/auth.service";
import { AuthController } from "@/auth/application/auth.controller";
import { PassportModule } from "@nestjs/passport";
import { UserRepository } from "@/auth/infrastructure/repositories/user.repository";
@Module({
  imports: [PassportModule],
  providers: [AuthService, UserRepository],
  controllers: [AuthController],
})
export class AuthModule {}
