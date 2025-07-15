import { Module } from '@nestjs/common';
import { UlidService } from './ulid.service';

@Module({
  providers: [UlidService],
  exports: [UlidService],
})
export class UlidModule {}
