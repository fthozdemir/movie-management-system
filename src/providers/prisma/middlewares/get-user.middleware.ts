import { Prisma } from "@prisma/client";

export function removePasswordMiddleware(): Prisma.Middleware {
  return async (params, next) => {
    // Run the query through Prisma
    const result = await next(params);

    // Check if the query is for a user or an array of users
    if (params.model === "User") {
      // Skip password removal for login-related operations
      if (params.args?.select?.password === true) {
        return result;
      }

      if (params.action === "findMany") {
        // Iterate over the results if it's an array of users
        result.forEach((user) => {
          delete user.password;
        });
      } else if (
        params.action === "findUnique" ||
        params.action === "findFirst"
      ) {
        // For single user queries
        if (result) {
          delete result.password;
        }
      }
    }
    return result;
  };
}
