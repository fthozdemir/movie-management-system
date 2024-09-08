import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

export class WatchTicketDto {
  @ApiProperty({ example: true, description: "Ticket usage status" })
  @IsBoolean()
  @IsOptional()
  watched?: boolean;
}
