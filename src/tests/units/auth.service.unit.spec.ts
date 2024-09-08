import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "@modules/auth/domain/services/auth.service";
import { UserRepository } from "@modules/auth/infrastructure/repositories/user.repository";
import { JwtService } from "@nestjs/jwt";
import { NOT_FOUND, USER_CONFLICT } from "@/constants/errors.constants";
import * as bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));
describe("AuthService", () => {
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findByUsername: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue("mockedToken"),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe("register", () => {
    it("should successfully register a new user", async () => {
      const mockUserDto = {
        username: "newUser",
        password: "pass123",
        age: 25,
        role: UserRole.CUSTOMER,
      };
      const createdUser = { id: 1, ...mockUserDto };

      jest.spyOn(userRepository, "findByUsername").mockResolvedValue(null);
      jest.spyOn(userRepository, "create").mockResolvedValue(createdUser);

      const result = await authService.register(mockUserDto);
      expect(result).toEqual(createdUser);
    });

    it("should throw a conflict exception if username is already taken", async () => {
      const mockUserDto = {
        username: "existingUser",
        password: "pass123",
        age: 25,
        role: UserRole.CUSTOMER,
      };
      const existingUser = { id: 1, ...mockUserDto };

      jest
        .spyOn(userRepository, "findByUsername")
        .mockResolvedValue(existingUser);

      await expect(authService.register(mockUserDto)).rejects.toThrow(
        USER_CONFLICT,
      );
    });
  });

  describe("login", () => {
    it("should return a token for valid credentials", async () => {
      const mockUser = {
        id: 1,
        username: "user",
        password: "pass123",
        role: UserRole.CUSTOMER,
        age: 25,
      };
      jest.spyOn(userRepository, "findByUsername").mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login("user", "pass123");
      expect(result).toEqual({ access_token: "mockedToken" });
    });

    it("should throw not found exception for invalid credentials", async () => {
      const mockUser = {
        id: 1,
        username: "user",
        password: "pass123",
        role: UserRole.CUSTOMER,
        age: 25,
      };
      jest.spyOn(userRepository, "findByUsername").mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login("user", "wrongPassword")).rejects.toThrow(
        NOT_FOUND,
      );
    });

    it("should throw not found exception if user does not exist", async () => {
      jest.spyOn(userRepository, "findByUsername").mockResolvedValue(null);

      await expect(
        authService.login("nonExistentUser", "pass123"),
      ).rejects.toThrow(NOT_FOUND);
    });
  });
});
