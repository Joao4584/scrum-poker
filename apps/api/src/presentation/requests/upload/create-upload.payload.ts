export interface CreateUploadPayload {
  buffer: Buffer;
  original_name: string;
  mime_type: string;
  room_id: number | null;
  room_public_id: string | null;
}
