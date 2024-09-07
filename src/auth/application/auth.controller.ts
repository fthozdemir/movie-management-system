import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "../domain/services/auth.service";
import { ApiBody, ApiTags } from "@nestjs/swagger";

import ApiBaseResponses from "@/decorators/api-base-response.decorator";
import { LoginDto, RegisterDto, UserBaseDto } from "../dto";
import Serialize from "@/decorators/serialize.decorator";

@ApiTags("auth")
@ApiBaseResponses()
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: RegisterDto })
  @Serialize(UserBaseDto)
  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return user;
  }

  @ApiBody({ type: LoginDto })
  @Post("login")
  async login(@Body() { username, password }: LoginDto) {
    return this.authService.login(username, password);
  }
}
