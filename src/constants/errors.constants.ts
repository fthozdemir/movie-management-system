export interface IError {
  message: string;
  status: number;
  code: number;
}
export const NOT_FOUND: IError = {
  message: "Not Found",
  status: 404,
  code: 40400,
};

export const PRISMA_API_ERROR: IError = {
  message: "Prisma API Error",
  status: 500,
  code: 50001,
};

export const FORBIDDEN_RESOURCE: IError = {
  message: "Forbidden Resource",
  status: 403,
  code: 40300,
};

export const UNAUTHORIZED_RESOURCE: IError = {
  message: "Unauthorized Resource",
  status: 401,
  code: 40100,
};

export const INTERNAL_SERVER_ERROR: IError = {
  message: "Internal Server Error",
  status: 500,
  code: 50000,
};

export const BAD_REQUEST: IError = {
  message: "Bad Request",
  status: 400,
  code: 40000,
};

export const RATE_LIMIT_EXCEEDED = {
  message: "Rate Limit Exceeded",
  status: 429,
  code: "42900",
};

export const VALIDATION_ERROR = {
  message: "Validation Error",
  status: 400,
  code: "40001",
};

export const USER_CONFLICT = {
  message: "User already exists",
  status: 409,
  code: 40900,
};
