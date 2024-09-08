import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/providers/prisma";
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

  async listMovies(): Promise<IMovie[]> {
    return this.prisma.movie.findMany({
      include: {
        sessions: {
          include: { movie: true },
        },
      },
    });
  }
  async findAll(): Promise<IMovie[]> {
    return this.prisma.movie.findMany({});
  }
  async findById(id: number): Promise<IMovie | null> {
    return this.prisma.movie.findUnique({ where: { id } });
  }
}
