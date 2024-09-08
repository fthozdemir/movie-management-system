import { IMovie, IRepository } from "@/interfaces";
export interface IMovieRepository extends IRepository<IMovie> {
  listMovies(): Promise<IMovie[]>;
}
