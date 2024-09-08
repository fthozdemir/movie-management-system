import { BadRequestException, Injectable } from "@nestjs/common";
import { TimeSlot } from "@prisma/client";
import { ISession } from "@/interfaces";
import { maxRoomNumber } from "@/constants/session.constants";
import { SessionRepository } from "@/modules/movie/infrastructure/repositories/session.repository";
@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async addSession(
    movieId: number,
    date: Date,
    timeSlot: TimeSlot,
    roomNumber: number,
  ) {
    if (roomNumber < 0 || roomNumber > maxRoomNumber) {
      throw new BadRequestException("Invalid room number");
    }
    return this.sessionRepository.create({
      movieId,
      date,
      timeSlot,
      roomNumber,
    });
  }

  async addBulkSessions(
    movieId: ISession["id"],
    sessions: Omit<ISession, "id" | "movie" | "movieId">[],
  ) {
    const createdSessions = [];

    for (const session of sessions) {
      const newSession = await this.addSession(
        movieId,
        session.date,
        session.timeSlot,
        session.roomNumber,
      );
      createdSessions.push(newSession);
    }

    return createdSessions;
  }
  async updateSession(
    id: ISession["id"],
    session: Omit<ISession, "id" | "movieId" | "movie">,
  ) {
    return this.sessionRepository.updateSession(id, session);
  }
}
