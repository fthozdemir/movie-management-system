import { Test, TestingModule } from "@nestjs/testing";
import { MovieService } from "@modules/movie/domain/services/movie.service";
import { MovieRepository } from "@modules/movie/infrastructure/repositories/movie.repository";
import { IMovie } from "@/interfaces";

describe("MovieService", () => {
  let movieService: MovieService;
  let movieRepository: MovieRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: MovieRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            listMovies: jest.fn(),
          },
        },
      ],
    }).compile();

    movieService = module.get<MovieService>(MovieService);
    movieRepository = module.get<MovieRepository>(MovieRepository);
  });

  describe("createMovie", () => {
    it("should successfully create a movie", async () => {
      const movieData = { name: "New Movie", ageRestriction: 15 };
      const expectedMovie = { id: 1, ...movieData };
      jest.spyOn(movieRepository, "create").mockResolvedValue(expectedMovie);

      const result = await movieService.createMovie(
        movieData.name,
        movieData.ageRestriction,
      );
      expect(result).toEqual(expectedMovie);
      expect(movieRepository.create).toHaveBeenCalledWith(movieData);
    });
  });

  describe("updateMovie", () => {
    it("should update a movie and return the updated details", async () => {
      const movie = { id: 1, name: "Updated Movie", ageRestriction: 18 };
      jest.spyOn(movieRepository, "update").mockResolvedValue(movie);

      const result = await movieService.updateMovie(movie);
      expect(result).toEqual(movie);
      expect(movieRepository.update).toHaveBeenCalledWith(movie.id, {
        name: movie.name,
        ageRestriction: movie.ageRestriction,
      });
    });
  });

  describe("deleteMovie", () => {
    it("should delete a movie and return the deleted movie's details", async () => {
      const movieId = 1;
      const expectedResponse = {
        id: movieId,
        name: "Deleted Movie",
        ageRestriction: 18,
      };
      jest.spyOn(movieRepository, "delete").mockResolvedValue(expectedResponse);

      const result = await movieService.deleteMovie(movieId);
      expect(result).toEqual(expectedResponse);
      expect(movieRepository.delete).toHaveBeenCalledWith(movieId);
    });
  });

  describe("listMovies", () => {
    it("should return a list of movies based on the provided parameters", async () => {
      const sortBy = "name" as keyof IMovie;
      const order: "asc" | "desc" = "asc";
      const params = { limit: 10, page: 1, sortBy, order };
      const expectedMovies = [{ id: 1, name: "Movie A", ageRestriction: 12 }];
      jest
        .spyOn(movieRepository, "listMovies")
        .mockResolvedValue(expectedMovies);

      const result = await movieService.listMovies(params);
      expect(result).toEqual(expectedMovies);
      expect(movieRepository.listMovies).toHaveBeenCalledWith(params);
    });
  });
});
