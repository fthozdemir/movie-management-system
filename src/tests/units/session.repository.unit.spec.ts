import { Test, TestingModule } from "@nestjs/testing";
import { SessionRepository } from "@/modules/movie/infrastructure/repositories/session.repository";
import { PrismaService } from "@providers/prisma";
import { TimeSlot } from "@/interfaces";

describe("SessionRepository", () => {
  let sessionRepository: SessionRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionRepository,
        {
          provide: PrismaService,
          useValue: {
            session: {
              create: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    sessionRepository = module.get<SessionRepository>(SessionRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });
  describe("create", () => {
    it("should create a new session and return it", async () => {
      const sessionData = {
        movieId: 1,
        date: new Date(),
        timeSlot: TimeSlot.SLOT_18_20,
        roomNumber: 5,
      };
      const expectedSession = { id: 1, ...sessionData, movie: {} };
      jest
        .spyOn(prismaService.session, "create")
        .mockResolvedValue(expectedSession);

      const result = await sessionRepository.create(sessionData);
      expect(result).toEqual(expectedSession);
      expect(prismaService.session.create).toHaveBeenCalledWith({
        data: sessionData,
        include: { movie: true },
      });
    });
  });
  describe("updateSession", () => {
    it("should update a session and return the updated session", async () => {
      const updatedSessionData = {
        date: new Date(),
        timeSlot: TimeSlot.SLOT_16_18,
        movieId: 1,
        roomNumber: 10,
      };
      const sessionId = 1;
      const expectedSession = {
        id: sessionId,
        ...updatedSessionData,
        movie: {},
      };
      jest
        .spyOn(prismaService.session, "update")
        .mockResolvedValue(expectedSession);

      const result = await sessionRepository.updateSession(
        sessionId,
        updatedSessionData,
      );
      expect(result).toEqual(expectedSession);
      expect(prismaService.session.update).toHaveBeenCalledWith({
        where: { id: sessionId },
        data: updatedSessionData,
        include: { movie: true },
      });
    });
  });
  describe("findById", () => {
    it("should return a session by its ID", async () => {
      const sessionId = 1;
      const expectedSession = {
        id: sessionId,
        movieId: 1,
        date: new Date(),
        timeSlot: TimeSlot.SLOT_20_22,
        roomNumber: 5,
        movie: {},
      };
      jest
        .spyOn(prismaService.session, "findUnique")
        .mockResolvedValue(expectedSession);

      const result = await sessionRepository.findById(sessionId);
      expect(result).toEqual(expectedSession);
      expect(prismaService.session.findUnique).toHaveBeenCalledWith({
        where: { id: sessionId },
        include: { movie: true },
      });
    });
  });
  describe("findAll", () => {
    it("should return all sessions", async () => {
      const sessions = [
        {
          id: 1,
          movieId: 1,
          date: new Date(),
          timeSlot: TimeSlot.SLOT_10_12,
          roomNumber: 1,
          movie: {},
        },
        {
          id: 2,
          movieId: 2,
          date: new Date(),
          timeSlot: TimeSlot.SLOT_10_12,
          roomNumber: 2,
          movie: {},
        },
      ];
      jest.spyOn(prismaService.session, "findMany").mockResolvedValue(sessions);

      const result = await sessionRepository.findAll();
      expect(result).toEqual(sessions);
      expect(prismaService.session.findMany).toHaveBeenCalledWith({
        include: { movie: true },
      });
    });
  });
  describe("delete", () => {
    it("should delete a session and return the deleted session's details", async () => {
      const sessionId = 1;
      const expectedSession = {
        id: sessionId,
        movieId: 1,
        date: new Date(),
        timeSlot: TimeSlot.SLOT_14_16,
        roomNumber: 3,
        movie: {},
      };
      jest
        .spyOn(prismaService.session, "delete")
        .mockResolvedValue(expectedSession);

      const result = await sessionRepository.delete(sessionId);
      expect(result).toEqual(expectedSession);
      expect(prismaService.session.delete).toHaveBeenCalledWith({
        where: { id: sessionId },
      });
    });
  });
});
