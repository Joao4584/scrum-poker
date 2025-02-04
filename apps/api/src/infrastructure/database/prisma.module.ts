import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Global()
@Module({
  providers: [
    {
      provide: PrismaClient,
      useFactory: async () => {
        const prisma = new PrismaClient({
          log: ['query', 'info', 'warn', 'error'],
        });

        await prisma.$connect();

        return prisma;
      },
    },
  ],
  exports: [PrismaClient],
})
export class PrismaModule {}
