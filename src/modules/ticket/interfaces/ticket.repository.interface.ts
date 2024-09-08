import { ITicket, IRepository } from "@/interfaces";
import { Prisma } from "@prisma/client";
export interface ITicketRepository extends IRepository<ITicket> {
  findMany(
    where: Prisma.TicketWhereInput,
    orderBy?: Prisma.TicketOrderByWithRelationInput,
  ): Promise<ITicket[]>;

  findOne(options?: {
    where: Prisma.TicketWhereInput;
  }): Promise<ITicket | null>;
}
