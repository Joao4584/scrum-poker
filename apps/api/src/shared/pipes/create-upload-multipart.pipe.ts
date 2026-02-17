import { Injectable, PipeTransform } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Multipart, MultipartFile } from '@fastify/multipart';
import { Room } from '@/infrastructure/entities/room.entity';
import { AppErrors } from '@/presentation/errors';
import { CreateUploadPayload } from '@/presentation/requests/upload/create-upload.payload';
import { PublicIdEntityResolverService } from '@/shared/services/public-id-entity-resolver.service';

type MultipartFastifyRequest = FastifyRequest & {
  file: () => Promise<MultipartFile | undefined>;
};

@Injectable()
export class CreateUploadMultipartPipe implements PipeTransform<FastifyRequest, Promise<CreateUploadPayload>> {
  constructor(private readonly publicIdEntityResolver: PublicIdEntityResolverService) {}

  async transform(request: FastifyRequest): Promise<CreateUploadPayload> {
    const multipartRequest = request as MultipartFastifyRequest;
    const file = await multipartRequest.file();

    if (!file) {
      throw AppErrors.badRequest('Arquivo nao enviado');
    }

    const roomId = this.parseRoomId(file);
    const roomPublicId = this.parseRoomPublicId(file);

    if (roomId === null && !roomPublicId) {
      throw AppErrors.badRequest('room_id ou room_public_id obrigatorio');
    }

    const room =
      roomId === null && roomPublicId
        ? await this.publicIdEntityResolver.resolve(Room, roomPublicId, {
            entityLabel: 'Sala',
            required: true,
          })
        : null;

    return {
      buffer: await file.toBuffer(),
      original_name: file.filename,
      mime_type: file.mimetype,
      room_id: roomId ?? room?.id ?? null,
      room_public_id: room?.public_id ?? roomPublicId ?? null,
    };
  }

  private parseRoomId(file: MultipartFile): number | null {
    const value = this.parseFieldValue(file, 'room_id');

    if (value === null) {
      return null;
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw AppErrors.badRequest('room_id deve ser um numero inteiro positivo');
    }

    return parsed;
  }

  private parseRoomPublicId(file: MultipartFile): string | null {
    const value = this.parseFieldValue(file, 'room_public_id');

    if (value === null) {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  private parseFieldValue(file: MultipartFile, fieldName: string): string | null {
    const field = file.fields?.[fieldName];

    if (!field) {
      return null;
    }

    const firstField = Array.isArray(field) ? field[0] : field;
    const value = firstField && this.isMultipartField(firstField) ? firstField.value : null;

    if (value === undefined || value === null || value === '') {
      return null;
    }

    return String(value);
  }

  private isMultipartField(part: Multipart): part is Extract<Multipart, { type: 'field' }> {
    return part.type === 'field';
  }
}
