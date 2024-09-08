import { Test, TestingModule } from "@nestjs/testing";
import { MovieRepository } from "@modules/movie/infrastructure/repositories/movie.repository";
import { PrismaService } from "@providers/prisma";
import { IMovie } from "@/interfaces";

describe("MovieRepository", () => {
  let movieRepository: MovieRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieRepository,
        {
          provide: PrismaService,
          useValue: {
            movie: {
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    movieRepository = module.get<MovieRepository>(MovieRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });
  describe("create", () => {
    it("should create a new movie and return it", async () => {
      const mockMovieData = { name: "Inception", ageRestriction: 13 };
      const createdMovie = { id: 1, ...mockMovieData };
      jest
        .spyOn(prismaService.movie, "create")
        .mockResolvedValueOnce(createdMovie);

      const result = await movieRepository.create(mockMovieData);
      expect(result).toEqual(createdMovie);
      expect(prismaService.movie.create).toHaveBeenCalledWith({
        data: mockMovieData,
      });
    });
  });
  describe("update", () => {
    it("should update an existing movie and return it", async () => {
      const updatedMovieData = { name: "Inception 2", ageRestriction: 13 };
      const movieId = 1;
      const updatedMovie = { id: movieId, ...updatedMovieData };
      jest
        .spyOn(prismaService.movie, "update")
        .mockResolvedValueOnce(updatedMovie);

      const result = await movieRepository.update(movieId, updatedMovieData);
      expect(result).toEqual(updatedMovie);
      expect(prismaService.movie.update).toHaveBeenCalledWith({
        where: { id: movieId },
        data: updatedMovieData,
      });
    });
  });
  describe("delete", () => {
    it("should delete a movie and return the deleted movie", async () => {
      const movieId = 1;
      const deletedMovie = {
        id: movieId,
        name: "Inception",
        ageRestriction: 13,
      };
      jest
        .spyOn(prismaService.movie, "delete")
        .mockResolvedValueOnce(deletedMovie);

      const result = await movieRepository.delete(movieId);
      expect(result).toEqual(deletedMovie);
      expect(prismaService.movie.delete).toHaveBeenCalledWith({
        where: { id: movieId },
      });
    });
  });

  describe("listMovies", () => {
    it("should list movies with pagination and sorting", async () => {
      const sortBy = "name" as keyof IMovie;
      const order: "asc" | "desc" = "asc";
      const params = { limit: 2, page: 1, sortBy, order };
      const movies = [
        { id: 1, name: "A Movie", ageRestriction: 13 },
        { id: 2, name: "B Movie", ageRestriction: 13 },
      ];
      jest.spyOn(prismaService.movie, "findMany").mockResolvedValueOnce(movies);

      const result = await movieRepository.listMovies(params);
      expect(result).toEqual(movies);
      expect(prismaService.movie.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0, // (page - 1) * limit
          take: 2,
          orderBy: { name: "asc" },
        }),
      );
    });
  });
});
