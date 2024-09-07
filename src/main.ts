import { NestFactory, HttpAdapterHost } from "@nestjs/core";
import { AppModule } from "@/app";
import { CustomLogger } from "@/utils/logger";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe, Logger } from "@nestjs/common";
import { AllExceptionsFilter } from "@/filters/all-exception.filter";
import { PrismaClientExceptionFilter } from "@/providers/prisma/prisma-client-exception.filter";
import { ValidationExceptionFilter } from "@/filters/validation-exception.filter";
import validationExceptionFactory from "@/filters/validation-exception-factory";
import { BadRequestExceptionFilter } from "@/filters/bad-request-exception.filter";
import { ThrottlerExceptionsFilter } from "@/filters/throttler-exception.filter";
//import { TransformInterceptor } from "@/interceptors/transform.interceptor";
import { AccessExceptionFilter } from "@/filters/access-exception.filter";
import { NotFoundExceptionFilter } from "@/filters/not-found-exception.filter";
import { EConfigKey, IAppConfig } from "@/interfaces";
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
    bodyParser: true,
  });

  const configService = app.get(ConfigService);
  const appConfig: IAppConfig = configService.get(EConfigKey.App);
  //const swaggerConfig = configService.get("swagger");

  {
    /**
     * ValidationPipe options
     * https://docs.nestjs.com/pipes#validation-pipe
     */
    const options = {
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
    };

    app.useGlobalPipes(
      new ValidationPipe({
        ...options,
        exceptionFactory: validationExceptionFactory,
      }),
    );
  }

  {
    /**
     * Enable global filters
     * https://docs.nestjs.com/exception-filters
     */
    const { httpAdapter } = app.get(HttpAdapterHost);

    app.useGlobalFilters(
      new AllExceptionsFilter(),
      new AccessExceptionFilter(httpAdapter),
      new NotFoundExceptionFilter(),
      new BadRequestExceptionFilter(),
      new PrismaClientExceptionFilter(httpAdapter),
      new ValidationExceptionFilter(),
      new ThrottlerExceptionsFilter(),
    );
  }

  //TODO:set global prefix for all routes except GET

  //TODO: add versioning
  //TODO: swagger config
  /*
  {
    // Setup Swagger API documentation
    // https://docs.nestjs.com/openapi/introduction
    // https://medium.com/@a16n.dev/password-protecting-swagger-documentation-in-nestjs-53a5edf60fa0
    //
    app.use(
      ["/docs"],
      basicAuth({
        challenge: true,
        users: {
          admin: swaggerConfig.password,
        },
      }),
    );

    const options: Omit<OpenAPIObject, "paths"> = new DocumentBuilder()
      .setTitle("Api v1")
      .setDescription("Starter API v1")
      .setVersion("1.0")
      .addBearerAuth({ in: "header", type: "http" })
      .build();
    const document: OpenAPIObject = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup("docs", app, document, {
      swaggerOptions: {
        // If set to true, it persists authorization data,
        // and it would not be lost on browser close/refresh
        persistAuthorization: true,
      },
    });
  }
    */
  await app.listen(appConfig.port);

  return appConfig;
}
bootstrap().then((appConfig) => {
  Logger.log(`Running in http://localhost:${appConfig.port}`, "Bootstrap");
});
