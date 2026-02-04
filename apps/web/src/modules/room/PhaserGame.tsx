"use client";

import React, { useEffect, useRef, useState } from "react";
import * as Phaser from "phaser";
import { Client, type Room } from "colyseus.js";
import type { PlaygroundState } from "./@types/player";
import { useRoomStore } from "./stores/room-store";
import { buildIdentity } from "./utils/identity";
import { resolveServerUrl } from "./utils/server-url";
import { MainScene } from "./scenes/MainScene";
import Preloader from "./scenes/preloader";
import type { CreatePhaserGameOptions, PhaserGameProps } from "./@types/phaser";
import { useTheme } from "next-themes";

const BASE_GAME_WIDTH = 1280;
const BASE_GAME_HEIGHT = 720;
const TILE_SIZE = 32;
const USE_DYNAMIC_SCALE = process.env.NEXT_PUBLIC_PHASER_DYNAMIC_SCALE === "true";
const USE_QUANTIZED_DYNAMIC = process.env.NEXT_PUBLIC_PHASER_DYNAMIC_SCALE_QUANTIZED !== "false";

const quantizeToTile = (value: number) => Math.max(TILE_SIZE, Math.floor(value / TILE_SIZE) * TILE_SIZE);

const focusGame = (gameRef: React.RefObject<HTMLDivElement | null>) => {
  const canvas = gameRef.current?.querySelector("canvas");
  if (canvas) {
    canvas.setAttribute("tabindex", "0");
    (canvas as HTMLCanvasElement).focus();
  }
};

function createPhaserGame({ parent, room, backgroundColor }: CreatePhaserGameOptions) {
  const parentRect = parent?.getBoundingClientRect();
  const rawInitialWidth = parentRect?.width ? Math.floor(parentRect.width) : BASE_GAME_WIDTH;
  const rawInitialHeight = parentRect?.height ? Math.floor(parentRect.height) : BASE_GAME_HEIGHT;
  const initialWidth =
    USE_DYNAMIC_SCALE && USE_QUANTIZED_DYNAMIC ? quantizeToTile(rawInitialWidth) : rawInitialWidth;
  const initialHeight =
    USE_DYNAMIC_SCALE && USE_QUANTIZED_DYNAMIC ? quantizeToTile(rawInitialHeight) : rawInitialHeight;

  return new Phaser.Game({
    type: Phaser.CANVAS,
    resolution: 1,
    width: USE_DYNAMIC_SCALE ? initialWidth : BASE_GAME_WIDTH,
    height: USE_DYNAMIC_SCALE ? initialHeight : BASE_GAME_HEIGHT,
    pixelArt: true,
    render: {
      pixelArt: true,
      antialias: false,
      roundPixels: true,
    },
    canvasStyle: "image-rendering: pixelated; image-rendering: crisp-edges;",
    parent: parent || undefined,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0, x: 0 },
      },
    },
    scene: [Preloader, MainScene],
    scale: USE_DYNAMIC_SCALE
      ? {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          autoRound: true,
        }
      : {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          autoRound: true,
        },
    callbacks: {
      postBoot: (game) => {
        game.registry.set("room", room);
        if (backgroundColor) {
          game.registry.set("room-background", backgroundColor);
        }
        console.log("[phaser] booted, room set in registry");
      },
    },
  });
}

export const PhaserGame: React.FC<PhaserGameProps> = ({ skin, userId, displayName, roomPublicId }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<ReturnType<typeof createPhaserGame> | null>(null);
  const roomRef = useRef<Room<PlaygroundState> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const setRoom = useRoomStore((s) => s.setRoom);
  const setFocusGame = useRoomStore((s) => s.setFocusGame);
  const setKeyboardToggle = useRoomStore((s) => s.setKeyboardToggle);
  const { resolvedTheme, theme } = useTheme();
  const activeTheme = resolvedTheme ?? theme;
  const backgroundColor = activeTheme === "light" ? "#4fbeff" : "#0b1220";

  useEffect(() => {
    const game = phaserGameRef.current;
    if (game) {
      game.registry.set("room-background", backgroundColor);
      const scene = game.scene.getScene("game") as Phaser.Scene | null;
      scene?.cameras?.main?.setBackgroundColor(backgroundColor);
    }
  }, [backgroundColor]);

  useEffect(() => {
    if (!gameRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      const game = phaserGameRef.current;
      if (game && width > 0 && height > 0) {
        const parentWidth = Math.floor(width);
        const parentHeight = Math.floor(height);
        if (USE_DYNAMIC_SCALE) {
          const nextWidth = USE_QUANTIZED_DYNAMIC ? quantizeToTile(parentWidth) : parentWidth;
          const nextHeight = USE_QUANTIZED_DYNAMIC ? quantizeToTile(parentHeight) : parentHeight;
          game.scale.resize(nextWidth, nextHeight);
        } else {
          game.scale.setParentSize?.(parentWidth, parentHeight);
          game.scale.refresh?.();
        }
      }
    });

    observer.observe(gameRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const startGame = (room: Room<PlaygroundState>) => {
      if (phaserGameRef.current) return;

      console.log("[colyseus] joined", room.roomId, "session", room.sessionId);
      phaserGameRef.current = createPhaserGame({ parent: gameRef.current, room, backgroundColor });
      setTimeout(() => focusGame(gameRef), 100);
      setFocusGame(() => () => focusGame(gameRef));
      setKeyboardToggle(() => (enabled: boolean) => {
        if (gameRef.current) {
          const canvas = gameRef.current.querySelector("canvas") as HTMLCanvasElement | null;
          if (canvas) {
            if (!canvas.hasAttribute("tabindex")) canvas.setAttribute("tabindex", "0");
            if (enabled) {
              canvas.focus();
            }
          }
        }
        phaserGameRef.current?.input?.keyboard && (phaserGameRef.current.input.keyboard.enabled = enabled);
      });
    };

    const connect = async () => {
      try {
        const client = new Client(resolveServerUrl());
        const identity = buildIdentity(userId, displayName);
        const room = await client.joinOrCreate<PlaygroundState>("playground", {
          id: identity.id ?? undefined,
          name: identity.name,
          color: identity.color,
          skin,
          roomPublicId,
        });

        if (cancelled) {
          await room.leave();
          return;
        }

        roomRef.current = room;
        setRoom(room);
        startGame(room);
      } catch (err) {
        if (!cancelled) {
          const isAlreadyConnected = err instanceof Error && err.message.includes("ALREADY_CONNECTED");
          if (!isAlreadyConnected) {
            console.error("[colyseus] connection failed", err);
          }
          const message = isAlreadyConnected ? "Ja existe outra guia aberta nesta sala." : "Nao foi possivel conectar ao game-server.";
          setError(message);
        }
      }
    };

    connect();

    return () => {
      cancelled = true;
      roomRef.current?.leave();
      setRoom(undefined);
      setFocusGame(undefined);
      phaserGameRef.current?.destroy(true);
      phaserGameRef.current = null;
      setKeyboardToggle(undefined);
    };
  }, [skin, userId, roomPublicId]);

  if (error) return <div className="w-full h-full flex items-center justify-center text-sm text-red-200 bg-slate-900">{error}</div>;

  const scaleMode = USE_DYNAMIC_SCALE ? (USE_QUANTIZED_DYNAMIC ? "quantized" : "dynamic") : "fixed";
  return (
    <div
      id="phaser-game-container"
      data-scale-mode={scaleMode}
      ref={gameRef}
      style={{ width: "100%", height: "100%", backgroundColor }}
    />
  );
};
