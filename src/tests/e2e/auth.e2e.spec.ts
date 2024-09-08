import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "@/app/app.module";
import { LoginDto, RegisterDto } from "@/modules/auth/dto";
import { UserRole } from "@prisma/client";
import { PrismaService } from "@/providers/prisma";

import { migrateDatabase } from "@/tests/jest.setup";

describe("AuthController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const prismaService = app.get(PrismaService);
    try {
      await prismaService.$connect();
    } catch {
      await migrateDatabase(); // Run migrations before all tests in this suite
    }

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });
  afterAll(async () => {
    const prismaService = app.get(PrismaService);
    await prismaService.user.deleteMany({});
  });

  it("/auth/register (POST)", async () => {
    const registerDto: RegisterDto = {
      username: "newuser",
      password: "password123",
      age: 22,
      role: UserRole.CUSTOMER,
    };

    const response = await request(app.getHttpServer())
      .post("/auth/register")
      .send(registerDto)
      .expect(201);

    expect(response.body).toEqual({
      id: expect.any(Number),
      username: registerDto.username,
      age: registerDto.age,
      role: registerDto.role,
    });
  });

  it("/auth/login (POST)", async () => {
    const loginDto: LoginDto = {
      username: "newuser",
      password: "password123",
    };

    await request(app.getHttpServer())
      .post("/auth/register") // Setup user for login test
      .send({
        username: loginDto.username,
        password: loginDto.password,
        age: 22,
        role: "USER",
      });

    const response = await request(app.getHttpServer())
      .post("/auth/login")
      .send(loginDto)
      .expect(201);

    expect(response.body).toHaveProperty("access_token");
  });
  it("/auth/register (POST) with missing fields", async () => {
    const incompleteData = {
      username: "testuser",
    };

    await request(app.getHttpServer())
      .post("/auth/register")
      .send(incompleteData)
      .expect(500);
  });
  it("/auth/register (POST) with existing username", async () => {
    const userData = {
      username: "existinguser",
      password: "password123",
      age: 22,
      role: UserRole.CUSTOMER,
    };

    // First register to create the user
    await request(app.getHttpServer())
      .post("/auth/register")
      .send(userData)
      .expect(201);

    // Try to register again with the same username
    await request(app.getHttpServer())
      .post("/auth/register")
      .send(userData)
      .expect(409); // Expecting a conflict error
  });
  it("/auth/login (POST) with incorrect password", async () => {
    const userData = {
      username: "user",
      password: "correctPassword",
      age: 22,
      role: UserRole.CUSTOMER,
    };

    // Register a user first
    await request(app.getHttpServer())
      .post("/auth/register")
      .send(userData)
      .expect(201);

    // Attempt to log in with an incorrect password
    const loginAttempt = {
      username: "user",
      password: "wrongPassword",
    };

    await request(app.getHttpServer())
      .post("/auth/login")
      .send(loginAttempt)
      .expect(404); // Expecting a not found error due to incorrect password
  });
  it("/auth/login (POST) with nonexistent username", async () => {
    const loginAttempt = {
      username: "nonexistentUser",
      password: "somePassword",
    };

    await request(app.getHttpServer())
      .post("/auth/login")
      .send(loginAttempt)
      .expect(404);
  });
});
