import { Injectable } from "@nestjs/common";
import { IMovie } from "@/interfaces";
import { MovieRepository } from "@modules/movie/infrastructure/repositories/movie.repository";

@Injectable()
export class MovieService {
  constructor(private readonly movieRepository: MovieRepository) {}

  async createMovie(name: string, ageRestriction: number) {
    return this.movieRepository.create({ name, ageRestriction });
  }

  async updateMovie(movie: IMovie) {
    return this.movieRepository.update(movie.id, {
      name: movie.name,
      ageRestriction: movie.ageRestriction,
    });
  }

  async deleteMovie(id: number) {
    return this.movieRepository.delete(id);
  }

  async listMovies(params: {
    limit?: number;
    page?: number;
    sortBy?: keyof IMovie;
    order?: "asc" | "desc";
  }): Promise<IMovie[]> {
    return this.movieRepository.listMovies(params);
  }
}
