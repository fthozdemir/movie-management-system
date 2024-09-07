import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@/utils/logger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });

  const port = 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
