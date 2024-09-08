import { BadRequestException, Injectable } from "@nestjs/common";
import { TicketRepository } from "@/modules/ticket/infrastructure/repositories/ticket.repository";
import {
  AGE_RESTRICTION,
  SESSIN_NOT_AVAILABLE,
  SESSIN_SOLD_OUT,
  TICKET_NOT_FOUND,
  TICKET_WATCHED,
} from "@/constants/errors.constants";
import { IUser, ITicket } from "@/interfaces";
import { SessionRepository } from "@/modules/movie/infrastructure/repositories/session.repository";
@Injectable()
export class TicketService {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async buyTicket(
    sessionId: number,
    user: IUser,
  ): Promise<Omit<ITicket, "id">> {
    // check if session is available
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) {
      throw new BadRequestException(SESSIN_NOT_AVAILABLE);
    }
    // check if user has already bought a ticket for this session
    const tickets = await this.ticketRepository.findMany({
      sessionId,
    });
    if (tickets.length > 0) {
      throw new BadRequestException(SESSIN_SOLD_OUT);
    }

    // age Restriction check
    if (session.movie.ageRestriction > user.age) {
      throw new BadRequestException(AGE_RESTRICTION);
    }

    return this.ticketRepository.create({ sessionId, userId: user.id });
  }

  async watchTicket(user: IUser, id: number): Promise<Omit<ITicket, "id">> {
    // ticket not found or not bought by user
    const ticket = await this.ticketRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!ticket) {
      throw new BadRequestException(TICKET_NOT_FOUND);
    }
    if (ticket.watched) {
      throw new BadRequestException(TICKET_WATCHED);
    }
    return this.ticketRepository.update(id, { watched: true });
  }

  async getTicketsForUser(userId: number) {
    return this.ticketRepository.findMany({
      userId,
    });
  }
  async getWatchHistory(userId: number) {
    return this.ticketRepository.findMany({
      userId,
      watched: true,
    });
  }

  async deleteTicket(id: number, user: IUser) {
    if (user.role === "MANAGER") return this.ticketRepository.delete(id);

    const ticket = await this.ticketRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!ticket) {
      throw new BadRequestException(TICKET_NOT_FOUND);
    }
    if (ticket.watched) {
      throw new BadRequestException(TICKET_WATCHED);
    }
    return this.ticketRepository.delete(id);
  }
}
