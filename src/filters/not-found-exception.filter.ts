import {
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";
import { NOT_FOUND } from "@/constants/errors.constants";

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: any) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    const status: number = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.NOT_FOUND;

    const exceptionResponse = {
      success: false,
      error: {
        code: NOT_FOUND.code,
        message: NOT_FOUND.message,
        details: exception.getResponse(),
      },
    };

    return res.status(status).json(exceptionResponse);
  }
}
