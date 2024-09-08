import { IsString, IsNotEmpty, Length, IsInt, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMovieDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Length(0, 100)
  readonly name!: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(100)
  readonly ageRestriction!: number;
}
