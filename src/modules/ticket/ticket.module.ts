import { Module } from "@nestjs/common";
import { TicketController } from "./application/ticket.controller";
import { TicketService } from "./domain/services/ticket.service";
import { TicketRepository } from "./infrastructure/repositories/ticket.repository";
import { MovieModule } from "@modules/movie/movie.module";
import { SessionRepository } from "@modules/movie/infrastructure/repositories/session.repository";
@Module({
  imports: [MovieModule],
  controllers: [TicketController],
  providers: [TicketService, TicketRepository, SessionRepository],
})
export class TicketModule {}
