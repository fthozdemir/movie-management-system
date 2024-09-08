import { IMovie, IRepository } from "@/interfaces";
export interface IMovieRepository extends IRepository<IMovie> {
  listMovies(params: {
    limit?: number;
    page?: number;
    sortBy?: keyof IMovie;
    order?: "asc" | "desc";
  }): Promise<IMovie[]>;
}
