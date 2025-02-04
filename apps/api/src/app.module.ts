import { Module } from '@nestjs/common';
import { PrismaModule } from 'infrastructure/database/prisma.module';
import { UserModule } from 'modules/user/user.module';

@Module({
  imports: [UserModule, PrismaModule],
})
export class AppModule {}
