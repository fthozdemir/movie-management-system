import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsNumber,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IUser } from "@/interfaces";

export class RegisterDto implements Omit<IUser, "id" | "tickets"> {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly username!: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(MANAGER|CUSTOMER)$/, {
    message: "role must be either 'MANAGER' or 'CUSTOMER'",
  })
  readonly role!: IUser["role"];

  @ApiPropertyOptional({ type: String })
  @IsNumber()
  @IsNotEmpty()
  readonly age!: number;

  @ApiProperty({ type: String })
  @IsString()
  @Length(6, 20)
  @Matches(/[\d\W]/, {
    message:
      "password must contain at least one digit and/or special character",
  })
  @Matches(/[a-zA-Z]/, { message: "password must contain at least one letter" })
  @Matches(/^\S+$/, { message: "password must not contain spaces" })
  readonly password!: string;
}
