import { Injectable } from "@nestjs/common";
import { PrismaService } from "@providers/prisma";
import { IUserRepository } from "@/interfaces";
import { User } from "@prisma/client";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}
  async create(user: Omit<User, "id" | "tickets">): Promise<User> {
    return this.prisma.user.create({
      data: user,
    });
  }

  async findByUsername(
    username: string,
    includePassword?: boolean,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: includePassword,
        age: true,
        role: true,
      },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({});
  }
  async update(id: number, data: Omit<User, "id" | "tickets">): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
