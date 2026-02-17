import { Injectable } from '@nestjs/common';
import { RoomTypeOrmRepository } from '@/infrastructure/repositories/room.repository';
import { UploadFileTypeOrmRepository } from '@/infrastructure/repositories/upload-file.repository';

@Injectable()
export class ListUserRoomsUseCase {
  constructor(
    private readonly roomsRepository: RoomTypeOrmRepository,
    private readonly uploadFileRepository: UploadFileTypeOrmRepository,
  ) {}

  async execute(
    user_id: number,
    options: {
      order?: 'ASC' | 'DESC';
      sort?: 'recent' | 'alphabetical' | 'players';
      owner_only?: number | boolean | string;
    },
  ) {
    const owner_only =
      options.owner_only === 1 ||
      options.owner_only === true ||
      options.owner_only === '1' ||
      options.owner_only === 'true';

    const rooms = await this.roomsRepository.findRecentByUserId(user_id, {
      ...options,
      owner_only,
    });

    const roomIds = rooms.map((room) => room.id).filter((id): id is number => Boolean(id));
    const latestUploads = await this.uploadFileRepository.findLatestByRoomIds(roomIds);
    const latestUploadByRoomId = new Map(latestUploads.map((upload) => [upload.room_id, upload] as const));

    return rooms.map((room) => {
      const latestUpload = latestUploadByRoomId.get(room.id);
      const roomResponse = { ...room } as Record<string, unknown>;
      delete roomResponse.id;
      delete roomResponse.owner_id;
      delete roomResponse.password;
      delete roomResponse.owner;

      return {
        ...roomResponse,
        url_image: latestUpload ? `/upload/room/${room.public_id}/file` : null,
      };
    });
  }
}
