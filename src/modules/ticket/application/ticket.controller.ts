import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";
import ApiBaseResponses from "@/decorators/api-base-response.decorator";
import { CurrentUser } from "@/modules/auth/decorators/current-user.decorator";
import { TicketService } from "../domain/services/ticket.service";
import { CreateTicketDto } from "../dto";
import { IdParamDto } from "@/dto/id-param.dto";

import { IUser } from "@/interfaces";

@ApiTags("ticket")
@ApiBearerAuth()
@ApiBaseResponses()
@Controller("ticket")
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @ApiBody({ type: CreateTicketDto })
  @Post("buy")
  async buyTicket(
    @Body() { sessionId }: CreateTicketDto,
    @CurrentUser() user: IUser,
  ) {
    return this.ticketService.buyTicket(sessionId, user);
  }

  @ApiParam({ type: IdParamDto, name: "id" })
  @Patch("watch/:id")
  async watchTicket(@Param() { id }: IdParamDto, @CurrentUser() user: IUser) {
    return this.ticketService.watchTicket(user, Number(id));
  }

  @ApiParam({ type: IdParamDto, name: "id" })
  @Delete("cancel/:id")
  async cancelTicket(@Param() { id }: IdParamDto, @CurrentUser() user: IUser) {
    return this.ticketService.deleteTicket(Number(id), user);
  }

  @Get("watch-history")
  async listWatchHistory(@CurrentUser("id") userId: number) {
    return this.ticketService.getWatchHistory(userId);
  }
}
