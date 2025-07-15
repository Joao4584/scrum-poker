import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';

@Injectable()
export class UlidService {
  generateId(): string {
    return ulid();
  }
}
