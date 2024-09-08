import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "@/app/app.module";
import { PrismaService } from "@/providers/prisma";
import { migrateDatabase } from "@/tests/jest.setup";
import {
  CreateMovieDto,
  UpdateMovieDto,
  BulkSessionDto,
  SessionDto,
} from "@/modules/movie/dto";
import { TimeSlot, UserRole } from "@prisma/client";
import { LoginDto } from "@/modules/auth/dto";

describe("MovieController (e2e)", () => {
  let app: INestApplication;
  let managerToken: string;
  let customerToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    const prismaService = app.get(PrismaService);
    try {
      await prismaService.$connect();
    } catch {
      await migrateDatabase();
    }

    // Create a manager user
    await request(app.getHttpServer()).post("/auth/register").send({
      username: "manager",
      password: "password1",
      age: 30,
      role: UserRole.MANAGER,
    });

    // Login as manager
    managerToken = await loginUser(app, {
      username: "manager",
      password: "password1",
    });
  });

  afterEach(async () => {
    const prismaService = app.get(PrismaService);
    await prismaService.movie.deleteMany({});
    await prismaService.user.deleteMany({});
    await prismaService.session.deleteMany({});
    await app.close();
  });

  it("/movie/add (POST) as manager", async () => {
    const createMovieDto: CreateMovieDto = {
      name: "New Epic Movie",
      ageRestriction: 12,
    };

    const { body } = await request(app.getHttpServer())
      .post("/movie/add")
      .set("Authorization", `Bearer ${managerToken}`)

      .send(createMovieDto)
      .expect(201); // Ensure the correct response status

    expect(body).toEqual({
      id: expect.any(Number),
      name: createMovieDto.name,
      ageRestriction: createMovieDto.ageRestriction,
    });
  });

  it("/movie/update/:id (PATCH)", async () => {
    const movie = await request(app.getHttpServer())
      .post("/movie/add")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({ name: "Initial Movie", ageRestriction: 12 })
      .then((res) => res.body);

    const updateMovieDto: UpdateMovieDto = {
      name: "Updated Movie",
      ageRestriction: 15,
    };

    await request(app.getHttpServer())
      .patch(`/movie/update/${movie.id}`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send(updateMovieDto)
      .expect(200);
  });

  it("/movie/delete/:id (DELETE)", async () => {
    const movie = await request(app.getHttpServer())
      .post("/movie/add")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({ name: "Movie To Delete", ageRestriction: 12 })
      .then((res) => res.body);

    await request(app.getHttpServer())
      .delete(`/movie/delete/${movie.id}`)
      .set("Authorization", `Bearer ${managerToken}`)
      .expect(200); // Check for successful deletion
  });

  it("/movie/all (GET) customer user can list movies", async () => {
    // Create a Cusyomet user
    await request(app.getHttpServer()).post("/auth/register").send({
      username: "customer",
      password: "password1",
      age: 30,
      role: UserRole.CUSTOMER,
    });

    // Login as manager
    customerToken = await loginUser(app, {
      username: "customer",
      password: "password1",
    });
    await request(app.getHttpServer())
      .get("/movie/all?sortBy=name&order=asc&page=1&limit=10")
      .set("Authorization", `Bearer ${customerToken}`)
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it("/movie/:id/sessions (POST)", async () => {
    const res = await request(app.getHttpServer())
      .post("/movie/add")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({ name: "Movie With Sessions", ageRestriction: 12 });

    const movieId = res.body.id;
    console.log("movieId", movieId);
    const bulkSessionDto: BulkSessionDto = {
      sessions: [
        {
          date: new Date("2024-10-04"),
          timeSlot: TimeSlot.SLOT_10_12,
          roomNumber: 5,
        },
      ],
    };

    await request(app.getHttpServer())
      .post(`/movie/${movieId}/sessions`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send(bulkSessionDto)
      .expect(201);
  });

  it("/movie/session/:id (PATCH)", async () => {
    const movieResponse = await request(app.getHttpServer())
      .post("/movie/add")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({ name: "Movie With Sessions", ageRestriction: 12 });

    const movieId = movieResponse.body.id;

    const bulkSessionDto: BulkSessionDto = {
      sessions: [
        {
          date: new Date("2024-10-04"),
          timeSlot: TimeSlot.SLOT_10_12,
          roomNumber: 5,
        },
      ],
    };

    const sessionResponse = await request(app.getHttpServer())
      .post(`/movie/${movieId}/sessions`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send(bulkSessionDto)
      .expect(201);

    const sessionId = sessionResponse.body[0].id;
    const sessionDto: SessionDto = {
      date: new Date("2024-10-05"),
      timeSlot: TimeSlot.SLOT_10_12,
      roomNumber: 10,
    };

    await request(app.getHttpServer())
      .patch(`/movie/session/${sessionId}`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send(sessionDto)
      .expect(200);
  });
});

export async function loginUser(
  app: INestApplication,
  loginDto: LoginDto,
): Promise<string> {
  const response = await request(app.getHttpServer())
    .post("/auth/login")
    .send(loginDto);

  if (response.status !== 201) {
    throw new Error("Failed to log in for e2e test.");
  }

  return response.body.access_token;
}
