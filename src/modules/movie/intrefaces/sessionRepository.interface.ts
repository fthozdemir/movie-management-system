import { IRepository, ISession } from "@/interfaces";
export interface ISessionRepository extends IRepository<ISession> {
  updateSession(
    sessionId: number,
    updatedSession: Partial<ISession>,
  ): Promise<ISession>;
}
