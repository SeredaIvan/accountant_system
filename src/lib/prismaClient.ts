import dotenv from 'dotenv';
import {PrismaClient} from "@prisma/client/extension";

dotenv.config();

declare global {
    var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.DATABASE_URL) {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export { prisma };
