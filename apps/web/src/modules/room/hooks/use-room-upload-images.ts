import { useCallback, useEffect } from "react";
import { captureCanvasSnapshot } from "@/modules/shared/utils";
import { uploadRoomSnapshot } from "../services/upload-room-snapshot";

type FetchSource = "enter" | "after_10s" | "manual";

export function useRoomUploadImages(roomPublicId: string) {
  const fetchRoomUploads = useCallback(
    async (source: FetchSource) => {
      try {
        const snapshot = await captureCanvasSnapshot({
          selector: "#phaser-game-container canvas",
          maxWidth: 450,
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

  const refetchRoomUploads = useCallback(async () => {
    await fetchRoomUploads("manual");
  }, [fetchRoomUploads]);

  useEffect(() => {
    void fetchRoomUploads("enter");
    const timeoutId = window.setTimeout(() => {
      void fetchRoomUploads("after_10s");
    }, 10000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchRoomUploads]);

  return { refetchRoomUploads };
}
