import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "@/auth/infrastructure/repositories/user.repository";
import { IUser } from "@/interfaces";
import { NOT_FOUND, USER_CONFLICT } from "@/constants/errors.constants";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: Omit<IUser, "id" | "tickets">) {
    const { username, password, age, role } = registerDto;
    const currentUser = await this.userRepository.findByUsername(username);
    if (currentUser) {
      throw new ConflictException(USER_CONFLICT);
    }
    const user = await this.userRepository.create({
      username,
      password,
      age,
      role,
    });
    return user;
  }

  async login(username: string, password: string) {
    const user = await this.userRepository.findByUsername(username, true);
    if (user && (await bcrypt.compare(password, user.password))) {
      console.log("user", user);
      return this.generateToken(user);
    }
    throw new NotFoundException(NOT_FOUND);
  }

  private generateToken(user: IUser) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
