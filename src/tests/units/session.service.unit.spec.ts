import { Test, TestingModule } from "@nestjs/testing";
import { SessionService } from "@modules/movie/domain/services/session.service";
import { SessionRepository } from "@modules/movie/infrastructure/repositories/session.repository";
import { BadRequestException } from "@nestjs/common";
import { TimeSlot } from "@prisma/client";

describe("SessionService", () => {
  let sessionService: SessionService;
  let sessionRepository: SessionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: SessionRepository,
          useValue: {
            create: jest.fn(),
            updateSession: jest.fn(),
          },
        },
      ],
    }).compile();

    sessionService = module.get<SessionService>(SessionService);
    sessionRepository = module.get<SessionRepository>(SessionRepository);
  });
  describe("addSession", () => {
    it("should throw BadRequestException for invalid room number", async () => {
      const sessionData = {
        movieId: 1,
        date: new Date(),
        timeSlot: TimeSlot.SLOT_16_18,
        roomNumber: -1,
      };

      await expect(
        sessionService.addSession(
          sessionData.movieId,
          sessionData.date,
          sessionData.timeSlot,
          sessionData.roomNumber,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it("should successfully add a session for valid data", async () => {
      const sessionData = {
        movieId: 1,
        date: new Date(),
        timeSlot: TimeSlot.SLOT_10_12,
        roomNumber: 5,
      };
      const expectedSession = { id: 1, ...sessionData };
      jest
        .spyOn(sessionRepository, "create")
        .mockResolvedValue(expectedSession);

      const result = await sessionService.addSession(
        sessionData.movieId,
        sessionData.date,
        sessionData.timeSlot,
        sessionData.roomNumber,
      );
      expect(result).toEqual(expectedSession);
      expect(sessionRepository.create).toHaveBeenCalledWith(sessionData);
    });
  });
  describe("addBulkSessions", () => {
    it("should add multiple sessions and return them", async () => {
      const sessions = [
        { date: new Date(), timeSlot: TimeSlot.SLOT_12_14, roomNumber: 1 },
        { date: new Date(), timeSlot: TimeSlot.SLOT_16_18, roomNumber: 2 },
      ];
      const movieId = 1;

      jest
        .spyOn(sessionService, "addSession")
        .mockImplementation(async (movieId, date, timeSlot, roomNumber) => ({
          id: Math.random(),
          movieId,
          date,
          timeSlot,
          roomNumber,
        }));

      const result = await sessionService.addBulkSessions(movieId, sessions);
      expect(result.length).toEqual(sessions.length);
      expect(sessionService.addSession).toHaveBeenCalledTimes(sessions.length);
    });
  });
  describe("updateSession", () => {
    it("should update a session and return the updated session", async () => {
      const sessionUpdate = {
        date: new Date(),
        timeSlot: TimeSlot.SLOT_14_16,
        movieId: 1,
        roomNumber: 3,
      };
      const sessionId = 1;
      const expectedSession = { id: sessionId, ...sessionUpdate };
      jest
        .spyOn(sessionRepository, "updateSession")
        .mockResolvedValue(expectedSession);

      const result = await sessionService.updateSession(
        sessionId,
        sessionUpdate,
      );
      expect(result).toEqual(expectedSession);
      expect(sessionRepository.updateSession).toHaveBeenCalledWith(
        sessionId,
        sessionUpdate,
      );
    });
  });
});
