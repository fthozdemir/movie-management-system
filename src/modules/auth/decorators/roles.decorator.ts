import { IUser } from "@/interfaces";
import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: IUser["role"][]) => SetMetadata("roles", roles);
