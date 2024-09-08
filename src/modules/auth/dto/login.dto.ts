import { IsString, IsNotEmpty, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly username!: string;

  @ApiProperty({ type: String })
  @IsString()
  @Length(6, 20)
  readonly password!: string;
}
