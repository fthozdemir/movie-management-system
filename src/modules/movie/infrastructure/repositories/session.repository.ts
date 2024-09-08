import { Injectable } from "@nestjs/common";
import { PrismaService } from "@providers/prisma";
import { ISession, ISessionRepository } from "@/interfaces";
import { TimeSlot } from "@/interfaces";
@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    movieId: number;
    date: Date;
    timeSlot: TimeSlot;
    roomNumber: number;
  }): Promise<ISession> {
    const { movieId, date, timeSlot, roomNumber } = data;
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
        movieId: updatedSession.movieId,
      },
      include: { movie: true },
    });
  }

  async findById(sessionId: number): Promise<ISession> {
    return this.prisma.session.findUnique({
      where: { id: sessionId },
      include: { movie: true },
    });
  }

  async findAll(): Promise<ISession[]> {
    return this.prisma.session.findMany({
      include: { movie: true },
    });
  }

  async delete(sessionId: number): Promise<ISession> {
    return this.prisma.session.delete({
      where: { id: sessionId },
    });
  }

  async update(id: number, data: Partial<ISession>): Promise<ISession> {
    console.log("update", id, data);
    throw new Error("Method not implemented.");
  }
}
