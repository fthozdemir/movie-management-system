import { ISession, IRepository } from "@/interfaces";
export interface ISessionRepository extends IRepository<ISession> {
  findByMovieId(movieId: number): Promise<ISession[]>;
}
