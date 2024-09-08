import { IsNotEmpty, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class MovieParamDto {
  @ApiProperty({ type: Number })
  @IsNumberString()
  @IsNotEmpty()
  readonly id!: number;
}
