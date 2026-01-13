"use client";

import React, { useEffect, useRef, useState } from "react";
import * as Phaser from "phaser";
import { Client, type Room } from "colyseus.js";
import type { PlaygroundState } from "./@types/player";
import { useRoomStore } from "./store/room-store";
import { buildIdentity } from "./utils/identity";
import { resolveServerUrl } from "./utils/server-url";
import { MainScene } from "./scenes/MainScene";
import Preloader from "./scenes/preloader";
import type { CreatePhaserGameOptions, PhaserGameProps } from "./@types/phaser";

const focusGame = (gameRef: React.RefObject<HTMLDivElement | null>) => {
  const canvas = gameRef.current?.querySelector("canvas");
  if (canvas) {
    canvas.setAttribute("tabindex", "0");
    (canvas as HTMLCanvasElement).focus();
  }
};

function createPhaserGame({ parent, room }: CreatePhaserGameOptions) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: "100%",
    height: "100%",
    pixelArt: true,
    render: {
      pixelArt: true,
      antialias: false,
      roundPixels: true,
    },
    parent: parent || undefined,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0, x: 0 },
      },
    },
    scene: [Preloader, MainScene],
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    callbacks: {
      postBoot: (game) => {
        game.registry.set("room", room);
        console.log("[phaser] booted, room set in registry");
      },
    },
  });
}

export const PhaserGame: React.FC<PhaserGameProps> = ({ skin, userId }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<ReturnType<typeof createPhaserGame> | null>(null);
  const roomRef = useRef<Room<PlaygroundState> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const setRoom = useRoomStore((s) => s.setRoom);
  const setFocusGame = useRoomStore((s) => s.setFocusGame);
  const setKeyboardToggle = useRoomStore((s) => s.setKeyboardToggle);

  useEffect(() => {
    let cancelled = false;

    const startGame = (room: Room<PlaygroundState>) => {
      if (phaserGameRef.current) return;

      console.log("[colyseus] joined", room.roomId, "session", room.sessionId);
      phaserGameRef.current = createPhaserGame({ parent: gameRef.current, room });
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
        const identity = buildIdentity(userId);
        const room = await client.joinOrCreate<PlaygroundState>("playground", {
          id: identity.id ?? undefined,
          name: identity.name,
          color: identity.color,
          skin,
        });

        if (cancelled) {
          await room.leave();
          return;
        }

        roomRef.current = room;
        setRoom(room);
        startGame(room);
      } catch (err) {
        console.error("[colyseus] connection failed", err);
        if (!cancelled) {
          setError("Não foi possível conectar ao game-server.");
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
  }, []);

  if (error) return <div className="w-full h-full flex items-center justify-center text-sm text-red-200 bg-slate-900">{error}</div>;

  return <div id="phaser-game-container" ref={gameRef} style={{ width: "100%", height: "100%" }} />;
};
