import { PrismaClient } from "@prisma/client";

declare global {
  var cachedPrismaClient: PrismaClient;
}

let prismaClient: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prismaClient = new PrismaClient();
} else {
  if (!global.cachedPrismaClient) {
    global.cachedPrismaClient = new PrismaClient();
  }
  prismaClient = global.cachedPrismaClient;
}

export default prismaClient;
