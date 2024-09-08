import { IsNotEmpty, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class IdParamDto {
  @ApiProperty({ type: Number })
  @IsNumberString()
  @IsNotEmpty()
  readonly id!: string;
}
