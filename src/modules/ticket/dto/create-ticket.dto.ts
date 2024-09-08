import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateTicketDto {
  @ApiProperty({ example: 1, description: "ID of the session" })
  @IsInt()
  @IsNotEmpty()
  sessionId: number;
}
