import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/app/generated/prisma/client";

declare global {
  var prismaClient: PrismaClient | undefined;
}

function createClient() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
  return new PrismaClient({ adapter });
}

export const prisma = globalThis.prismaClient ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaClient = prisma;
}
