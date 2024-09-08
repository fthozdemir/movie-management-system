// ticket.e2e.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "@/app/app.module";
import { UserRole, TimeSlot } from "@prisma/client";
import { LoginDto } from "@/modules/auth/dto";
import { PrismaService } from "@/providers/prisma";
import { migrateDatabase } from "@/tests/jest.setup";

describe("TicketController (e2e)", () => {
  let app: INestApplication;
  let customerToken: string;
  let managerToken: string;
  let sessionId: number;

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
  });
  beforeEach(async () => {
    // Create a customer user
    await request(app.getHttpServer()).post("/auth/register").send({
      username: "user",
      password: "password1",
      age: 25,
      role: UserRole.CUSTOMER,
    });

    // Create a manager user
    await request(app.getHttpServer()).post("/auth/register").send({
      username: "manager",
      password: "password1",
      age: 30,
      role: UserRole.MANAGER,
    });

    // Login as customer
    customerToken = await loginUser(app, {
      username: "user",
      password: "password1",
    });

    // Login as manager
    managerToken = await loginUser(app, {
      username: "manager",
      password: "password1",
    });

    // Create a session as manager for testing
    const movieRes = await request(app.getHttpServer())
      .post("/movie/add")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({ name: "Test Movie", ageRestriction: 12 });

    const movieId = movieRes.body.id;
    const sessionRes = await request(app.getHttpServer())
      .post(`/movie/${movieId}/sessions`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        sessions: [
          { date: new Date(), timeSlot: TimeSlot.SLOT_10_12, roomNumber: 1 },
        ],
      });

    sessionId = sessionRes.body[0].id;
  });
  afterEach(async () => {
    const prismaService = app.get(PrismaService);
    await prismaService.movie.deleteMany({});
    await prismaService.user.deleteMany({});
    await prismaService.session.deleteMany({});
    await prismaService.ticket.deleteMany({});

    await app.close();
  });

  it("/ticket/buy (POST) should allow a customer to buy a ticket", async () => {
    const { body } = await request(app.getHttpServer())
      .post("/ticket/buy")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ sessionId })
      .expect(201);

    expect(body).toMatchObject({ sessionId, userId: expect.any(Number) });
  });

  it("/ticket/buy (POST) should not allow buying a ticket for the same session twice", async () => {
    await request(app.getHttpServer())
      .post("/ticket/buy")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ sessionId });
    await request(app.getHttpServer())
      .post("/ticket/buy")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ sessionId });
  });

  it("/ticket/watch/:id (PATCH) should allow a customer to mark a ticket as watched", async () => {
    const { body } = await request(app.getHttpServer())
      .post("/ticket/buy")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ sessionId });

    const ticketId = body.id;
    await request(app.getHttpServer())
      .patch(`/ticket/watch/${ticketId}`)
      .set("Authorization", `Bearer ${customerToken}`)
      .expect(200);
  });

  it("/ticket/cancel/:id (DELETE) should allow a customer to cancel a ticket", async () => {
    const { body } = await request(app.getHttpServer())
      .post("/ticket/buy")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ sessionId });

    const ticketId = body.id;
    console.log("ticketIdResponse", body);
    await request(app.getHttpServer())
      .delete(`/ticket/cancel/${ticketId}`)
      .set("Authorization", `Bearer ${customerToken}`)
      .expect(200);
  });

  it("/ticket/watch-history (GET) should list watched tickets", async () => {
    const ticketRes = await request(app.getHttpServer())
      .post("/ticket/buy")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ sessionId });

    const ticketId = ticketRes.body.id;
    await request(app.getHttpServer())
      .patch(`/ticket/watch/${ticketId}`)
      .set("Authorization", `Bearer ${customerToken}`);

    const { body } = await request(app.getHttpServer())
      .get("/ticket/watch-history")
      .set("Authorization", `Bearer ${customerToken}`)
      .expect(200);

    expect(Array.isArray(body)).toBe(true);
  });
});

async function loginUser(
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
