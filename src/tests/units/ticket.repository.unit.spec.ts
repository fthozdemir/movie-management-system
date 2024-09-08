import { Test, TestingModule } from "@nestjs/testing";
import { TicketRepository } from "@modules/ticket/infrastructure/repositories/ticket.repository";
import { PrismaService } from "@providers/prisma";
import { Prisma } from "@prisma/client";

describe("TicketRepository", () => {
  let ticketRepository: TicketRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketRepository,
        {
          provide: PrismaService,
          useValue: {
            ticket: {
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    ticketRepository = module.get<TicketRepository>(TicketRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });
  describe("create", () => {
    it("should create a ticket and return it", async () => {
      const ticketData = { userId: 1, sessionId: 2 };
      const expectedTicket = { id: 1, ...ticketData, watched: false };
      jest
        .spyOn(prismaService.ticket, "create")
        .mockResolvedValue(expectedTicket);

      const result = await ticketRepository.create(ticketData);
      expect(result).toEqual(expectedTicket);
      expect(prismaService.ticket.create).toHaveBeenCalledWith({
        data: ticketData,
      });
    });
  });
  describe("update", () => {
    it("should update a ticket and return the updated ticket", async () => {
      const ticketId = 1;
      const updatedData = { userId: 2, sessionId: 3, watched: true };
      const expectedTicket = { id: ticketId, ...updatedData };
      jest
        .spyOn(prismaService.ticket, "update")
        .mockResolvedValue(expectedTicket);

      const result = await ticketRepository.update(ticketId, updatedData);
      expect(result).toEqual(expectedTicket);
      expect(prismaService.ticket.update).toHaveBeenCalledWith({
        where: { id: ticketId },
        data: updatedData,
      });
    });
  });
  describe("delete", () => {
    it("should delete a ticket and return the deleted ticket's details", async () => {
      const ticketId = 1;
      const expectedTicket = {
        id: ticketId,
        userId: 2,
        sessionId: 3,
        watched: true,
      };
      jest
        .spyOn(prismaService.ticket, "delete")
        .mockResolvedValue(expectedTicket);

      const result = await ticketRepository.delete(ticketId);
      expect(result).toEqual(expectedTicket);
      expect(prismaService.ticket.delete).toHaveBeenCalledWith({
        where: { id: ticketId },
      });
    });
  });
  describe("findMany", () => {
    it("should return a list of tickets based on the query", async () => {
      const tickets = [
        { id: 1, userId: 1, sessionId: 2, watched: false },
        { id: 2, userId: 1, sessionId: 3, watched: true },
      ];
      const where = { userId: 1 };
      const orderBy = { sessionId: "asc" };
      jest.spyOn(prismaService.ticket, "findMany").mockResolvedValue(tickets);

      const result = await ticketRepository.findMany(
        where,
        orderBy as Prisma.TicketOrderByWithRelationInput,
      );
      expect(result).toEqual(tickets);
      expect(prismaService.ticket.findMany).toHaveBeenCalledWith({
        where,
        orderBy,
        include: { session: true },
      });
    });
  });
  describe("findOne", () => {
    it("should return a specific ticket using options", async () => {
      const ticket = { id: 1, userId: 1, sessionId: 2, watched: false };
      jest.spyOn(prismaService.ticket, "findFirst").mockResolvedValue(ticket);

      const result = await ticketRepository.findOne({ where: { id: 1 } });
      expect(result).toEqual(ticket);
      expect(prismaService.ticket.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { session: true },
      });
    });
  });

  describe("findById", () => {
    it("should return a ticket by its ID", async () => {
      const ticket = { id: 1, userId: 1, sessionId: 2, watched: false };
      jest.spyOn(prismaService.ticket, "findUnique").mockResolvedValue(ticket);

      const result = await ticketRepository.findById(1);
      expect(result).toEqual(ticket);
      expect(prismaService.ticket.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
