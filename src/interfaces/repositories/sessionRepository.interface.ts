import { ISession, TimeSlot } from "@/interfaces";
export interface ISessionRepository {
  addSession(
    movieId: number,
    date: Date,
    timeSlot: TimeSlot,
    roomNumber: number,
  ): Promise<ISession>;

  updateSession(
    sessionId: number,
    updatedSession: Partial<ISession>,
  ): Promise<ISession>;
}
