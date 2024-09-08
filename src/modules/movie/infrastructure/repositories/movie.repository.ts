import { Injectable } from "@nestjs/common";
import { PrismaService } from "@providers/prisma";
import { IMovie, IMovieRepository } from "@/interfaces";
@Injectable()
export class MovieRepository implements IMovieRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(movie: Omit<IMovie, "id">): Promise<IMovie> {
    return this.prisma.movie.create({
      data: {
        name: movie.name,
        ageRestriction: movie.ageRestriction,
      },
    });
  }

  async update(
    id: IMovie["id"],
    updatedMovie: Omit<IMovie, "id">,
  ): Promise<IMovie> {
    {
      return this.prisma.movie.update({
        where: { id },
        data: {
          name: updatedMovie.name,
          ageRestriction: updatedMovie.ageRestriction,
        },
      });
    }
  }
  async delete(id: IMovie["id"]): Promise<IMovie> {
    return this.prisma.movie.delete({
      where: { id },
    });
  }

  async listMovies(params: {
    limit?: number;
    page?: number;
    sortBy?: keyof IMovie;
    order?: "asc" | "desc";
  }): Promise<IMovie[]> {
    const { limit, page, sortBy, order } = params;
    const options: any = {};
    options.include = { sessions: { include: { movie: true } } };
    if (limit) {
      options.take = limit;
    }
    if (page) {
      options.skip = (page - 1) * (limit || 1);
    }
    if (sortBy) {
      options.orderBy = { [sortBy]: order || "asc" };
    }
    return this.prisma.movie.findMany({
      ...options,
    });
  }
  async findAll(): Promise<IMovie[]> {
    return this.prisma.movie.findMany({});
  }
  async findById(id: number): Promise<IMovie | null> {
    return this.prisma.movie.findUnique({ where: { id } });
  }
}
