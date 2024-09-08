import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  Query,
} from "@nestjs/common";
import { MovieService } from "../domain/services/movie.service";
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";
import ApiBaseResponses from "@/decorators/api-base-response.decorator";
import { CreateMovieDto, UpdateMovieDto } from "../dto";
import { IdParamDto } from "@/dto/id-param.dto";
import { BulkSessionDto, SessionDto } from "../dto/session.dto";
import { SessionService } from "../domain/services/session.service";
import { Roles } from "@modules/auth/decorators/roles.decorator";
import { IMovie, UserRole } from "@/interfaces";
@ApiTags("movie")
@ApiBearerAuth()
@ApiBaseResponses()
@Controller("movie")
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly sessionService: SessionService,
  ) {}

  @Roles(UserRole.MANAGER)
  @ApiBody({ type: CreateMovieDto })
  @Post("add")
  async createMovie(@Body() { name, ageRestriction }: CreateMovieDto) {
    return this.movieService.createMovie(name, ageRestriction);
  }

  @Roles(UserRole.MANAGER)
  @ApiBody({ type: UpdateMovieDto })
  @ApiParam({ type: IdParamDto, name: "id" })
  @Patch("update/:id")
  async updateMovie(
    @Param() { id }: IdParamDto,
    @Body() { name, ageRestriction }: UpdateMovieDto,
  ) {
    return this.movieService.updateMovie({
      id: Number(id),
      name,
      ageRestriction,
    });
  }
  @Roles(UserRole.MANAGER)
  @ApiParam({ type: IdParamDto, name: "id" })
  @Delete("delete/:id")
  async deleteMovie(@Param() { id }: IdParamDto) {
    return this.movieService.deleteMovie(Number(id));
  }

  @Get("all")
  async listMovies(
    @Query("sortBy") sortBy: keyof IMovie, // 'name', 'createdAt'
    @Query("order") order: "asc" | "desc", // 'asc', 'desc'
    @Query("page") page: string,
    @Query("limit") limit: string,
  ) {
    return this.movieService.listMovies({
      sortBy,
      order,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Roles(UserRole.MANAGER)
  @ApiParam({ type: IdParamDto, name: "id" })
  @ApiBody({ type: BulkSessionDto })
  @Post(":id/sessions")
  async addSessions(
    @Param() { id }: IdParamDto,
    @Body() { sessions }: BulkSessionDto,
  ) {
    return this.sessionService.addBulkSessions(Number(id), sessions);
  }

  @Roles(UserRole.MANAGER)
  @ApiParam({ type: IdParamDto, name: "id" })
  @ApiBody({ type: SessionDto })
  @Patch("session/:id")
  async updateSession(
    @Param() { id }: IdParamDto,
    @Body() { date, timeSlot, roomNumber }: SessionDto,
  ) {
    return this.sessionService.updateSession(Number(id), {
      date,
      timeSlot,
      roomNumber,
    });
  }
}
