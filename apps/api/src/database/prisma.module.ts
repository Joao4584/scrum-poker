import { Global, Module, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { Writable } from 'stream';

@Global()
@Module({
  providers: [
    {
      provide: 'PrismaConnect',
      useFactory: async () => {
        const logStream = fs.createWriteStream('__prisma.log', { flags: 'a' });
        const prisma = new PrismaClient({
          log: [
            { emit: 'event', level: 'query' },
            { emit: 'event', level: 'info' },
            { emit: 'event', level: 'warn' },
            { emit: 'event', level: 'error' },
          ],
        });

        const timestamp = new Date()
          .toISOString()
          .replace('T', ' ')
          .split('.')[0];

        prisma.$on('query', (e) =>
          logStream.write(`${timestamp} - [QUERY] ${e.query}\n`),
        );
        prisma.$on('info', (e) =>
          logStream.write(`${timestamp} - [INFO] ${e.message}\n`),
        );
        prisma.$on('warn', (e) =>
          logStream.write(`${timestamp} - [WARN] ${e.message}\n`),
        );
        prisma.$on('error', (e) =>
          logStream.write(`${timestamp} - [ERROR] ${e.message}\n`),
        );

        await prisma.$connect();

        return prisma;
      },
    },
  ],
  exports: ['PrismaConnect'],
})
export class PrismaModule implements OnModuleDestroy {
  onModuleDestroy() {
    fs.createWriteStream('__prisma.log', { flags: 'a' }).end();
  }
}
