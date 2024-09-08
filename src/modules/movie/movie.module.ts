import { Module } from "@nestjs/common";
import { MovieService } from "./domain/services/movie.service";
import { MovieRepository } from "./infrastructure/repositories/movie.repository";
import { MovieController } from "./application/movie.controller";
import { SessionService } from "./domain/services/session.service";
import { SessionRepository } from "./infrastructure/repositories/session.repository";

@Module({
  imports: [],
  controllers: [MovieController],
  providers: [MovieService, MovieRepository, SessionService, SessionRepository],
})
export class MovieModule {}
