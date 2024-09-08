import { Exclude, Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { ITicket, IUser } from "@/interfaces";
@Exclude()
export class UserBaseDto implements Partial<IUser> {
  @ApiProperty({ type: Number })
  @Expose()
  readonly id!: IUser["id"];

  @ApiProperty({ type: String })
  @Expose()
  readonly username!: string;

  @ApiProperty({ type: String, description: "User role" })
  @Expose()
  readonly role!: IUser["role"];

  @ApiProperty({ type: Number })
  @Expose()
  readonly age!: number;

  @ApiProperty({ type: String })
  @Expose()
  readonly tickets?: ITicket[];
}
