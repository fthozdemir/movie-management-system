import { PrismaClient } from "@prisma/client";

declare global {
  //eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// how to check is db connected

export const db = globalThis.prisma || new PrismaClient();
/*
 * In a production environment, the application typically does not reload
 * as frequently, so creating a new instance of PrismaClient each time is
 * less of a concern. Therefore, this singleton pattern is only applied during
 * development.
 */

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
