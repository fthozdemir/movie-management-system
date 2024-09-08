import { IUser, IRepository } from "@/interfaces";

export interface IUserRepository extends IRepository<IUser> {
  findByUsername(
    username: string,
    includePassword?: boolean,
  ): Promise<IUser | null>;
}
