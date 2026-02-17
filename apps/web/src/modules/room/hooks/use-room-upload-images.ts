import { useCallback } from "react";
import { captureCanvasSnapshot } from "@/modules/shared/utils";
import { uploadRoomSnapshot } from "../services/upload-room-snapshot";

type FetchSource = "after_10s" | "manual";

export function useRoomUploadImages(roomPublicId: string) {
  const fetchRoomUploads = useCallback(
    async (source: FetchSource) => {
      try {
        const snapshot = await captureCanvasSnapshot({
          selector: "#phaser-game-container canvas",
          maxWidth: 900,
          quality: 1,
        });
        const upload = await uploadRoomSnapshot({
          roomPublicId,
          file: snapshot,
        });
        console.log(`[room] snapshot upload (${source})`, roomPublicId, upload);
      } catch (error) {
        console.error("[room] failed to upload snapshot", error);
      }
    },
    [roomPublicId],
  );

  const refetchRoomUploads = useCallback(
    async (source: FetchSource = "manual") => {
      await fetchRoomUploads(source);
    },
    [fetchRoomUploads],
  );

  return { refetchRoomUploads };
}
