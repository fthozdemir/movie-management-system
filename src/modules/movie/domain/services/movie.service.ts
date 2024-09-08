import { Injectable } from "@nestjs/common";
import { MovieRepository } from "@modules/movie/infrastructure/repositories/movie.repository";
import { IMovie } from "@/interfaces";

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

  async listMovies() {
    return this.movieRepository.listMovies();
  }
}
