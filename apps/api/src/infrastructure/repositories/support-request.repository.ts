import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportRequest } from '@/infrastructure/entities/support-request.entity';

export interface CreateSupportRequestInput {
  public_id: string;
  user_id: number;
  subject: string;
  message: string;
  rating: number;
}

@Injectable()
export class SupportRequestTypeOrmRepository {
  constructor(
    @InjectRepository(SupportRequest)
    private readonly repository: Repository<SupportRequest>,
  ) {}

  async create(data: CreateSupportRequestInput): Promise<SupportRequest> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findByUserId(user_id: number): Promise<SupportRequest[]> {
    return await this.repository.find({
      where: { user_id },
      order: { created_at: 'DESC' },
    });
  }

  async findByPublicId(public_id: string): Promise<SupportRequest | null> {
    return await this.repository.findOne({
      where: { public_id },
    });
  }

  async softDeleteById(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }
}
