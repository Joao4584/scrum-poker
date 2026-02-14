import { UploadFile } from '@/infrastructure/entities/upload-file.entity';

export interface CreateUploadFileRecordInput {
  public_id: string;
  url: string;
  type: string;
  room_id?: number | null;
}

export interface UploadFileRepository {
  create(data: CreateUploadFileRecordInput): Promise<UploadFile>;
  findByPublicId(public_id: string, includeDeleted?: boolean): Promise<UploadFile | null>;
  softDeleteByPublicId(public_id: string): Promise<void>;
}
