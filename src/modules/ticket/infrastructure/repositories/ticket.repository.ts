import { Injectable } from "@nestjs/common";
import { PrismaService } from "@providers/prisma";
import { ITicket, ITicketRepository } from "@/interfaces";
import { Prisma } from "@prisma/client";

@Injectable()
export class TicketRepository implements ITicketRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(ticket: {
    userId: ITicket["userId"];
    sessionId: ITicket["sessionId"];
  }): Promise<ITicket> {
    const created = await this.prisma.ticket.create({
      data: {
        userId: ticket.userId,
        sessionId: ticket.sessionId,
      },
    });
    created.watched = created.watched || false;
    return created;
  }

  async update(
    id: ITicket["id"],
    updatedTicket: Partial<ITicket>,
  ): Promise<ITicket> {
    const data: any = {};
    if (updatedTicket.userId) data.userId = updatedTicket.userId;
    if (updatedTicket.sessionId) data.sessionId = updatedTicket.sessionId;
    if (updatedTicket.watched) data.watched = updatedTicket.watched;
    if (updatedTicket.session) data.session = updatedTicket.session;
    return this.prisma.ticket.update({
      where: { id },
      data,
    });
  }

  async delete(id: ITicket["id"]): Promise<ITicket> {
    return this.prisma.ticket.delete({
      where: { id },
    });
  }

  /**
   * @desc Find all users with pagination
   * @param where Prisma.UserWhereInput
   * @param orderBy Prisma.UserOrderByWithRelationInput
   * @returns Promise<PaginatorTypes.PaginatedResult<User>>
   */
  async findMany(
    where: Prisma.TicketWhereInput,
    orderBy?: Prisma.TicketOrderByWithRelationInput,
  ): Promise<ITicket[]> {
    return this.prisma.ticket.findMany({
      where,
      orderBy,
      include: {
        session: true,
      },
    });
  }

  async findOne(options?: {
    where: Prisma.TicketWhereInput;
  }): Promise<ITicket | null> {
    return this.prisma.ticket.findFirst({
      where: options?.where,
      include: {
        session: true,
      },
    });
  }
  async findById(id: number): Promise<ITicket | null> {
    return this.prisma.ticket.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<ITicket[]> {
    return this.prisma.ticket.findMany();
  }
}
