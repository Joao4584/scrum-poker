import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UlidModule } from '@/shared/ulid/ulid.module';
import { SupportRequest } from '@/infrastructure/entities/support-request.entity';
import { SupportRequestTypeOrmRepository } from '@/infrastructure/repositories/support-request.repository';
import { CreateSupportRequestUseCase } from '@/application/support/use-case/create-support-request.use-case';
import { ListSupportRequestsUseCase } from '@/application/support/use-case/list-support-requests.use-case';
import { DeleteSupportRequestUseCase } from '@/application/support/use-case/delete-support-request.use-case';
import { SupportController } from '@/presentation/controllers/support/support.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SupportRequest]), UlidModule],
  providers: [
    SupportRequestTypeOrmRepository,
    CreateSupportRequestUseCase,
    ListSupportRequestsUseCase,
    DeleteSupportRequestUseCase,
  ],
  controllers: [SupportController],
})
export class SupportModule {}
