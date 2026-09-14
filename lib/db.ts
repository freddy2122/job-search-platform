import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/app/generated/prisma/client";

declare global {
  var prismaClient: PrismaClient | undefined;
}

function createClient() {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalThis.prismaClient ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaClient = prisma;
}
