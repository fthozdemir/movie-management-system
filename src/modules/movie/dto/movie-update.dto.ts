import { IsString, Length, IsInt, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateMovieDto {
  @ApiProperty({ type: String })
  @IsString()
  @Length(0, 100)
  readonly name: string;

  @ApiProperty({ type: Number })
  @IsInt()
  @Min(1)
  @Max(100)
  readonly ageRestriction: number;
}
