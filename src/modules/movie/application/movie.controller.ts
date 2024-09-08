import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
} from "@nestjs/common";
import { MovieService } from "../domain/services/movie.service";
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";
import ApiBaseResponses from "@/decorators/api-base-response.decorator";
import { CreateMovieDto, MovieParamDto, UpdateMovieDto } from "../dto";
import { BulkSessionDto, SessionDto } from "../dto/session.dto";
import { SessionService } from "../domain/services/session.service";
import { Roles } from "@modules/auth/decorators/roles.decorator";
import { UserRole } from "@/interfaces";
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
  @Post()
  async createMovie(@Body() { name, ageRestriction }: CreateMovieDto) {
    return this.movieService.createMovie(name, ageRestriction);
  }

  @Roles(UserRole.MANAGER)
  @ApiBody({ type: UpdateMovieDto })
  @ApiParam({ type: MovieParamDto, name: "id" })
  @Patch(":id")
  async updateMovie(
    @Param() { id }: MovieParamDto,
    @Body() { name, ageRestriction }: UpdateMovieDto,
  ) {
    return this.movieService.updateMovie({
      id: Number(id),
      name,
      ageRestriction,
    });
  }
  @Roles(UserRole.MANAGER)
  @ApiParam({ type: MovieParamDto, name: "id" })
  @Delete(":id")
  async deleteMovie(@Param() { id }: MovieParamDto) {
    return this.movieService.deleteMovie(Number(id));
  }

  //TODO pagination
  @Get("all")
  @Roles(UserRole.MANAGER)
  async listMovies() {
    return this.movieService.listMovies();
  }

  @Roles(UserRole.MANAGER)
  @ApiParam({ type: MovieParamDto, name: "id" })
  @ApiBody({ type: BulkSessionDto })
  @Post(":id/sessions")
  async addSessions(
    @Param() { id }: MovieParamDto,
    @Body() { sessions }: BulkSessionDto,
  ) {
    return this.sessionService.addBulkSessions(Number(id), sessions);
  }

  @Roles(UserRole.MANAGER)
  @ApiParam({ type: MovieParamDto, name: "id" })
  @ApiBody({ type: SessionDto })
  @Patch("sessions/:id")
  async updateSession(
    @Param() { id }: MovieParamDto,
    @Body() { date, timeSlot, roomNumber }: SessionDto,
  ) {
    return this.sessionService.updateSession(Number(id), {
      date,
      timeSlot,
      roomNumber,
    });
  }
}
