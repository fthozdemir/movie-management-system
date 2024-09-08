import { Test, TestingModule } from "@nestjs/testing";
import { UserRepository } from "../../modules/auth/infrastructure/repositories/user.repository";
import { PrismaService } from "../../providers/prisma";
import { User, UserRole } from "@prisma/client";

describe("UserRepository", () => {
  let userRepository: UserRepository;
  let prismaService: PrismaService;

  // Define the mock user data outside of the test cases
  const mockUser: Omit<User, "id" | "tickets"> = {
    username: "testUser",
    password: "password123",
    age: 25,
    role: UserRole.CUSTOMER,
  };
  const createdUser: User = {
    id: 1,
    ...mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn().mockResolvedValue(createdUser),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe("create", () => {
    it("should create a new user record and return that", async () => {
      jest
        .spyOn(prismaService.user, "create")
        .mockResolvedValueOnce(createdUser);
      expect(await userRepository.create(mockUser)).toEqual(createdUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: mockUser,
      });
    });
  });

  it("should not create a new user record if the username already exists", async () => {
    jest.spyOn(prismaService.user, "create").mockRejectedValueOnce({
      code: "P2002",
    });
    await expect(userRepository.create(mockUser)).rejects.toBeTruthy();
    expect(prismaService.user.create).toHaveBeenCalledWith({
      data: mockUser,
    });
  });

  describe("findByUsername", () => {
    it("should return a user when the username matches", async () => {
      const username = "testUser";
      jest
        .spyOn(prismaService.user, "findUnique")
        .mockResolvedValueOnce(createdUser);

      const result = await userRepository.findByUsername(username);
      expect(result).toEqual(createdUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username },
        select: {
          id: true,
          username: true,
          age: true,
          role: true,
        },
      });
    });

    it("should include password if includePassword is true", async () => {
      const username = "testUser";
      jest.spyOn(prismaService.user, "findUnique").mockResolvedValueOnce({
        ...createdUser,
        password: "password123",
      });

      const result = await userRepository.findByUsername(username, true);
      expect(result).toHaveProperty("password", "password123");
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username },
        select: {
          id: true,
          username: true,
          password: true,
          age: true,
          role: true,
        },
      });
    });
  });

  describe("findById", () => {
    it("should return a user if the id matches", async () => {
      const id = 1;
      jest
        .spyOn(prismaService.user, "findUnique")
        .mockResolvedValueOnce(createdUser);

      const result = await userRepository.findById(id);
      expect(result).toEqual(createdUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe("findAll", () => {
    it("should return all users", async () => {
      jest
        .spyOn(prismaService.user, "findMany")
        .mockResolvedValueOnce([createdUser]);

      const result = await userRepository.findAll();
      expect(result).toEqual([createdUser]);
      expect(prismaService.user.findMany).toHaveBeenCalledWith({});
    });
  });

  describe("update", () => {
    it("should update an existing user and return the updated user", async () => {
      const updateData = {
        username: "updatedUser",
        password: "newPassword",
        age: 26,
        role: UserRole.MANAGER,
      };
      jest
        .spyOn(prismaService.user, "update")
        .mockResolvedValueOnce({ ...createdUser, ...updateData });

      const result = await userRepository.update(1, updateData);
      expect(result).toEqual({ ...createdUser, ...updateData });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
    });
  });
});
