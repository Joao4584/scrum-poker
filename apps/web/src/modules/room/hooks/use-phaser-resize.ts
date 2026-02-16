import { useEffect, type MutableRefObject, type RefObject } from "react";
import * as Phaser from "phaser";
import { resizePhaserGame } from "../lib/phaser-config";

type UsePhaserResizeParams = {
  containerRef: RefObject<HTMLDivElement | null>;
  gameRef: MutableRefObject<Phaser.Game | null>;
};

export function usePhaserResize({ containerRef, gameRef }: UsePhaserResizeParams) {
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const { width, height } = entry.contentRect;
      const game = gameRef.current;
      if (!game || width <= 0 || height <= 0) return;

      resizePhaserGame(game, width, height);
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [containerRef, gameRef]);
}
