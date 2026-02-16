import { api } from "@/modules/shared/http/api-client";

export interface RoomUploadSnapshot {
  public_id: string;
  room_public_id: string | null;
  url: string;
}

export interface UploadRoomSnapshotInput {
  roomPublicId: string;
  file: Blob;
  fileName?: string;
}

export async function uploadRoomSnapshot(input: UploadRoomSnapshotInput): Promise<RoomUploadSnapshot> {
  const formData = new FormData();
  formData.append("file", input.file, input.fileName ?? `room-${input.roomPublicId}-${Date.now()}.png`);
  formData.append("room_public_id", input.roomPublicId);

  return await api.post("upload", { body: formData }).json<RoomUploadSnapshot>();
}
