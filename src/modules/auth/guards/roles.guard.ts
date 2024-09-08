import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the roles defined by the @Roles decorator
    const requiredRoles = this.reflector.get<string[]>(
      "roles",
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // No roles specified, allow access
    }

    // Get the user from the request (set by AuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("No user found in request");
    }

    // Check if the user's role matches the required roles
    if (requiredRoles.includes(user.role)) {
      return true;
    } else {
      throw new ForbiddenException("Insufficient permissions");
    }
  }
}
