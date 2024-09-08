import { plainToClass } from "class-transformer";
import {
  IsDefined,
  IsEnum,
  IsNumberString,
  IsString,
  MinLength,
  validateSync,
} from "class-validator";
import { EEnvironment } from "./config.type";

class EnvironmentVariables {
  /* APP CONFIG */
  @IsDefined()
  @IsEnum(EEnvironment)
  NODE_ENV: EEnvironment;

  @IsDefined()
  @IsNumberString()
  @MinLength(1)
  PORT: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  DATABASE_URL: string;

  @IsDefined()
  @IsString()
  @MinLength(2)
  JWT_SECRET: string;
}

export function validateConfig(configuration: Record<string, unknown>) {
  const finalConfig = plainToClass(EnvironmentVariables, configuration, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(finalConfig, { skipMissingProperties: false });

  let index = 0;
  for (const err of errors) {
    Object.values(err.constraints).map((str) => {
      ++index;
      console.log(index, str);
    });
    console.log("\n ***** \n");
  }
  if (errors.length)
    throw new Error("Please provide the valid ENVs mentioned above");

  return finalConfig;
}
