import { PrismaClient } from '@prisma/client';

const Prisma =  global as unknown as { prisma : PrismaClient };

export const prisma =
    Prisma.prisma ||
    new PrismaClient({});

if (process.env.NODE_ENV!== 'production') Prisma.prisma = prisma;