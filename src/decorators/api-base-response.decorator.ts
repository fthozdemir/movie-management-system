import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED_RESOURCE,
} from "@/constants/errors.constants";
import { applyDecorators, HttpStatus } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

const ApiBaseResponses = () => {
  const decorators = [
    ApiUnauthorizedResponse({
      schema: {
        type: "object",
        example: {
          success: false,
          error: {
            code: UNAUTHORIZED_RESOURCE.code,
            message: UNAUTHORIZED_RESOURCE.message,
            details: "The resource you are trying to access is unauthorized.",
          },
        },
      },
      description: `${HttpStatus.UNAUTHORIZED}. Unauthorized.`,
    }),
    ApiBadRequestResponse({
      schema: {
        type: "object",
        example: {
          success: false,
          error: {
            code: BAD_REQUEST.code,
            message: BAD_REQUEST.message,
            details: "The request you are trying to make is invalid.",
          },
        },
      },
      description: `${HttpStatus.BAD_REQUEST}. Bad Request.`,
    }),
    ApiInternalServerErrorResponse({
      schema: {
        type: "object",
        example: {
          success: false,
          error: {
            code: INTERNAL_SERVER_ERROR.code,
            message: INTERNAL_SERVER_ERROR.message,
            details: "Something went wrong.",
          },
        },
      },
      description: `${HttpStatus.INTERNAL_SERVER_ERROR}. Internal Server Error.`,
    }),
    ApiNotFoundResponse({
      schema: {
        type: "object",
        example: {
          success: false,
          error: {
            code: NOT_FOUND.code,
            message: NOT_FOUND.message,
            details: "The resource you are trying to access does not exist.",
          },
        },
      },
      description: `${HttpStatus.NOT_FOUND}. Not found.`,
    }),
  ];

  return applyDecorators(...decorators);
};

export default ApiBaseResponses;
