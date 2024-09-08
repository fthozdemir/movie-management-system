import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  Min,
  IsInt,
  Max,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

import { ApiProperty } from "@nestjs/swagger";
import { TimeSlot } from "@/interfaces";
import { maxRoomNumber } from "@/constants/session.constants";
export class SessionDto {
  @ApiProperty({
    example: "2024-09-07",
    description: "The date of the movie session",
  })
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @ApiProperty({
    example: "10:00-12:00",
    description: "The time slot for the session",
    enum: TimeSlot,
  })
  @IsEnum(TimeSlot)
  @IsNotEmpty()
  timeSlot: TimeSlot;

  @ApiProperty({
    example: 1,
    description: `Room number where the session will be held, min: 0 max: ${maxRoomNumber}`,
  })
  @IsInt()
  @Min(0)
  @Max(maxRoomNumber)
  roomNumber: number;
}

export class BulkSessionDto {
  @ApiProperty({
    type: [SessionDto],
    description: "An array of sessions to be added",
  })
  @ValidateNested({ each: true })
  @Type(() => SessionDto)
  sessions: SessionDto[];
}
