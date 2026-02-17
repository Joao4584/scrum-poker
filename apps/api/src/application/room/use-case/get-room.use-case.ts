import { Injectable } from '@nestjs/common';
import { RoomTypeOrmRepository } from '@/infrastructure/repositories/room.repository';
import { UploadFileTypeOrmRepository } from '@/infrastructure/repositories/upload-file.repository';

@Injectable()
export class GetRoomUseCase {
  constructor(
    private readonly roomsRepository: RoomTypeOrmRepository,
    private readonly uploadFileRepository: UploadFileTypeOrmRepository,
  ) {}

  async execute(public_id: string) {
    const room = await this.roomsRepository.findByPublicId(public_id);
    if (!room) {
      return null;
    }

    const latestUpload = await this.uploadFileRepository.findLatestByRoomId(room.id);
    const roomResponse = { ...room } as Record<string, unknown>;
    delete roomResponse.id;
    delete roomResponse.owner_id;
    delete roomResponse.password;
    delete roomResponse.owner;

    return {
      ...roomResponse,
      url_image: latestUpload ? `/upload/room/${room.public_id}/file` : null,
    };
  }
}
