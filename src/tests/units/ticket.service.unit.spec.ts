import { Test, TestingModule } from "@nestjs/testing";
import { TicketService } from "@/modules/ticket/domain/services/ticket.service";
import { TicketRepository } from "@/modules/ticket/infrastructure/repositories/ticket.repository";
import { SessionRepository } from "@/modules/movie/infrastructure/repositories/session.repository";
import { BadRequestException } from "@nestjs/common";
import { ITicket, UserRole } from "@/interfaces";
import {
  AGE_RESTRICTION,
  SESSIN_SOLD_OUT,
  TICKET_NOT_FOUND,
  TICKET_WATCHED,
} from "@/constants/errors.constants";
import { IUser, ISession } from "@/interfaces";

describe("TicketService", () => {
  let ticketService: TicketService;
  let ticketRepository: TicketRepository;
  let sessionRepository: SessionRepository;
  const user: IUser = {
    id: 1,
    age: 25,
    role: UserRole.CUSTOMER,
    password: "",
    username: "name",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        {
          provide: TicketRepository,
          useValue: {
            create: jest.fn(),
            findMany: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: SessionRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    ticketService = module.get<TicketService>(TicketService);
    ticketRepository = module.get<TicketRepository>(TicketRepository);
    sessionRepository = module.get<SessionRepository>(SessionRepository);
  });
  describe("buyTicket", () => {
    it("should throw an error if the session is not available", async () => {
      jest.spyOn(sessionRepository, "findById").mockResolvedValue(null);

      await expect(ticketService.buyTicket(1, user)).rejects.toThrow(
        BadRequestException,
      );
      expect(sessionRepository.findById).toHaveBeenCalledWith(1);
    });

    it("should throw an error if the session is sold out", async () => {
      const session: ISession = {
        id: 1,
        movie: { id: 1, name: "movie", ageRestriction: 18 },
        movieId: 1,
        date: new Date(),
        timeSlot: "SLOT_10_12",
        roomNumber: 1,
        tickets: [],
      };

      // Mocking findById to simulate finding a valid session
      jest.spyOn(sessionRepository, "findById").mockResolvedValue(session);

      // Mocking findMany to simulate all tickets being sold for this session
      jest
        .spyOn(ticketRepository, "findMany")
        .mockResolvedValue([
          { id: 1, userId: 1, sessionId: 1, watched: false },
        ]); // Represents at least one ticket exists, indicating "sold out"

      // Testing the buyTicket function to see if it handles the sold out scenario correctly
      await expect(ticketService.buyTicket(1, user)).rejects.toThrow(
        SESSIN_SOLD_OUT,
      );
      expect(sessionRepository.findById).toHaveBeenCalledWith(1);
      expect(ticketRepository.findMany).toHaveBeenCalledWith({ sessionId: 1 });
    });

    it("should throw an error if user does not meet age restriction", async () => {
      const session: ISession = {
        id: 1,
        movie: { id: 1, name: "movie", ageRestriction: 80 },
        movieId: 1,
        date: new Date(),
        timeSlot: "SLOT_10_12",
        roomNumber: 1,
        tickets: [],
      };
      jest.spyOn(sessionRepository, "findById").mockResolvedValue(session);
      jest.spyOn(ticketRepository, "findMany").mockResolvedValue([]); // Not sold out

      await expect(ticketService.buyTicket(1, user)).rejects.toThrow(
        AGE_RESTRICTION,
      );
    });

    it("should create a ticket when all conditions are met", async () => {
      const session: ISession = {
        id: 1,
        movie: { id: 1, name: "movie", ageRestriction: 18 },
        movieId: 1,
        date: new Date(),
        timeSlot: "SLOT_10_12",
        roomNumber: 1,
        tickets: [],
      };
      jest.spyOn(sessionRepository, "findById").mockResolvedValue(session);
      jest.spyOn(ticketRepository, "findMany").mockResolvedValue([]); // Not sold out
      jest
        .spyOn(ticketRepository, "create")
        .mockResolvedValue({ id: 1, userId: 1, sessionId: 1, watched: false });

      const result = await ticketService.buyTicket(1, user);
      expect(result).toEqual({
        id: 1,
        userId: 1,
        sessionId: 1,
        watched: false,
      });
    });
  });
  describe("watchTicket", () => {
    it("should throw an error if the ticket does not exist", async () => {
      jest.spyOn(ticketRepository, "findOne").mockResolvedValue(null);

      await expect(ticketService.watchTicket(user, 1)).rejects.toThrow(
        TICKET_NOT_FOUND,
      );
    });

    it("should throw an error if the ticket is already watched", async () => {
      const ticket: ITicket = { id: 1, userId: 1, sessionId: 2, watched: true };
      jest.spyOn(ticketRepository, "findOne").mockResolvedValue(ticket);

      await expect(ticketService.watchTicket(user, 1)).rejects.toThrow(
        TICKET_WATCHED,
      );
    });

    it("should mark a ticket as watched successfully", async () => {
      const ticket: ITicket = {
        id: 1,
        userId: 1,
        sessionId: 2,
        watched: false,
      };
      jest.spyOn(ticketRepository, "findOne").mockResolvedValue(ticket);
      jest
        .spyOn(ticketRepository, "update")
        .mockResolvedValue({ ...ticket, watched: true });

      const result = await ticketService.watchTicket(user, 1);
      expect(result).toEqual({ ...ticket, watched: true });
    });
  });
  describe("getTicketsForUser", () => {
    it("should retrieve all tickets for a given user", async () => {
      const userId = 1;
      const expectedTickets = [
        { id: 1, userId: userId, sessionId: 2, watched: false },
        { id: 2, userId: userId, sessionId: 3, watched: true },
      ];
      jest
        .spyOn(ticketRepository, "findMany")
        .mockResolvedValue(expectedTickets);

      const result = await ticketService.getTicketsForUser(userId);
      expect(result).toEqual(expectedTickets);
      expect(ticketRepository.findMany).toHaveBeenCalledWith({ userId });
    });
  });

  describe("getWatchHistory", () => {
    it("should retrieve all watched tickets for a user", async () => {
      const userId = 1;
      const expectedTickets = [
        { id: 1, userId: userId, sessionId: 2, watched: true },
        { id: 2, userId: userId, sessionId: 3, watched: true },
      ];
      jest
        .spyOn(ticketRepository, "findMany")
        .mockResolvedValue(expectedTickets);

      const result = await ticketService.getWatchHistory(userId);
      expect(result).toEqual(expectedTickets);
      expect(ticketRepository.findMany).toHaveBeenCalledWith({
        userId,
        watched: true,
      });
    });
  });
  describe("deleteTicket", () => {
    it("should allow a manager to delete any ticket", async () => {
      const user: IUser = {
        id: 1,
        role: "MANAGER",
        username: "name",
        password: "",
        age: 25,
      };
      const ticketId = 1;
      const expectedDeletedTicket = {
        id: ticketId,
        userId: 2,
        sessionId: 3,
        watched: true,
      };
      jest
        .spyOn(ticketRepository, "delete")
        .mockResolvedValue(expectedDeletedTicket);

      const result = await ticketService.deleteTicket(ticketId, user);
      expect(result).toEqual(expectedDeletedTicket);
      expect(ticketRepository.delete).toHaveBeenCalledWith(ticketId);
    });

    it("should delete a ticket for the ticket owner if not watched", async () => {
      const ticketId = 1;
      const ticket = {
        id: ticketId,
        userId: user.id,
        sessionId: 3,
        watched: false,
      };
      jest.spyOn(ticketRepository, "findOne").mockResolvedValue(ticket);
      jest.spyOn(ticketRepository, "delete").mockResolvedValue(ticket);

      const result = await ticketService.deleteTicket(ticketId, user);
      expect(result).toEqual(ticket);
      expect(ticketRepository.delete).toHaveBeenCalledWith(ticketId);
    });

    it("should throw an error if the ticket does not exist", async () => {
      const ticketId = 1;
      jest.spyOn(ticketRepository, "findOne").mockResolvedValue(null);

      await expect(ticketService.deleteTicket(ticketId, user)).rejects.toThrow(
        TICKET_NOT_FOUND,
      );
    });

    it("should throw an error if the ticket is already watched", async () => {
      const ticketId = 1;
      const ticket = {
        id: ticketId,
        userId: user.id,
        sessionId: 3,
        watched: true,
      };
      jest.spyOn(ticketRepository, "findOne").mockResolvedValue(ticket);

      await expect(ticketService.deleteTicket(ticketId, user)).rejects.toThrow(
        TICKET_WATCHED,
      );
    });
  });
});
