import { useEffect, useRef, type RefObject } from "react";
import * as Phaser from "phaser";
import type { Room } from "colyseus.js";
import type { PlaygroundState } from "../@types/player";
import { createPhaserGame } from "../lib/phaser-config";
import { focusCanvas, setKeyboardEnabled } from "../lib/focus-canvas";

type UsePhaserGameParams = {
  containerRef: RefObject<HTMLDivElement | null>;
  room: Room<PlaygroundState> | null;
  backgroundColor: string;
  setFocusGame: (fn?: () => void) => void;
  setKeyboardToggle: (fn?: (enabled: boolean) => void) => void;
};

export function usePhaserGame({
  containerRef,
  room,
  backgroundColor,
  setFocusGame,
  setKeyboardToggle,
}: UsePhaserGameParams) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const backgroundColorRef = useRef(backgroundColor);

  useEffect(() => {
    backgroundColorRef.current = backgroundColor;
    const game = gameRef.current;
    if (!game) return;

    game.registry.set("room-background", backgroundColor);
    const scene = game.scene.getScene("game") as Phaser.Scene | null;
    scene?.cameras?.main?.setBackgroundColor(backgroundColor);
  }, [backgroundColor]);

  useEffect(() => {
    if (!room) return;
    if (!containerRef.current) return;
    if (gameRef.current) return;

    gameRef.current = createPhaserGame({ parent: containerRef.current, room, backgroundColor: backgroundColorRef.current });
    requestAnimationFrame(() => focusCanvas(containerRef.current));

    setFocusGame(() => () => focusCanvas(containerRef.current));
    setKeyboardToggle(
      () => (enabled: boolean) => setKeyboardEnabled(containerRef.current, enabled, gameRef.current),
    );

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
      setFocusGame(undefined);
      setKeyboardToggle(undefined);
    };
  }, [room, containerRef, setFocusGame, setKeyboardToggle]);

  return { gameRef };
}
