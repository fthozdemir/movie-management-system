import { IUser } from "@/interfaces";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Custom decorator to extract the currently authenticated user from the request.
 * If a specific property is passed as an argument, it returns that property of the user object.
 * Otherwise, it returns the whole user object.
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as IUser;
    return data ? user?.[data] : user;
  },
);
