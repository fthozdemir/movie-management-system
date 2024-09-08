import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/providers/prisma";
import { ISession, ISessionRepository } from "@/interfaces";
import { TimeSlot } from "@/interfaces";
@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addSession(
    movieId: number,
    date: Date,
    timeSlot: TimeSlot,
    roomNumber: number,
  ): Promise<ISession> {
    return this.prisma.session.create({
      data: {
        movieId,
        date: new Date(date),
        timeSlot,
        roomNumber,
      },
      include: { movie: true },
    });
  }

  async updateSession(
    sessionId: ISession["id"],
    updatedSession: Partial<ISession>,
  ): Promise<ISession> {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: {
        date: updatedSession.date,
        timeSlot: updatedSession.timeSlot,
        roomNumber: updatedSession.roomNumber,
      },
      include: { movie: true },
    });
  }
}
