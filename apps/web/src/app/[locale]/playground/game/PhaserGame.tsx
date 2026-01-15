"use client";

import React, { useEffect, useRef, useState } from "react";
import * as Phaser from "phaser";
import { Client, type Room } from "colyseus.js";
import { MainScene } from "./scenes/MainScene";
import Preloader from "./scenes/preloader";
import type { PlaygroundState } from "./network/types";
import { startBot } from "./network/bot";
import { useRoomStore } from "./room-store";
import Image from "next/image";

function resolveServerUrl() {
  if (process.env.NEXT_PUBLIC_GAME_SERVER_URL) {
    return process.env.NEXT_PUBLIC_GAME_SERVER_URL;
  }

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.hostname;
    const port = process.env.NEXT_PUBLIC_GAME_SERVER_PORT ?? "2567";
    return `${protocol}://${host}:${port}`;
  }

  return "ws://localhost:2567";
}

function randomName() {
  return `Guest-${Math.floor(Math.random() * 9_000 + 1_000)}`;
}

type PhaserGameProps = {
  skin: string;
  userId?: string | null;
  botCount: number;
};

export const PhaserGame: React.FC<PhaserGameProps> = ({ skin, userId, botCount }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const roomRef = useRef<Room<PlaygroundState> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const botCleanupRef = useRef<(() => void)[]>([]);
  const setRoom = useRoomStore((s) => s.setRoom);
  const setFocusGame = useRoomStore((s) => s.setFocusGame);
  const setKeyboardToggle = useRoomStore((s) => s.setKeyboardToggle);

  const focusGame = () => {
    const canvas = gameRef.current?.querySelector("canvas");
    if (canvas) {
      canvas.setAttribute("tabindex", "0");
      (canvas as HTMLCanvasElement).focus();
    }
  };

  const buildIdentity = () => {
    const id = userId ?? null;
    const name = id ? `User-${id}` : randomName();
    const colorFromId = () => {
      if (!id) return undefined;
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
        hash = (hash << 5) - hash + id.charCodeAt(i);
        hash |= 0;
      }
      const hue = Math.abs(hash) % 360;
      return `#${Phaser.Display.Color.HSLToColor(hue / 360, 0.55, 0.6)
        .color.toString(16)
        .padStart(6, "0")}`;
    };
    return { id, name, color: colorFromId() };
  };

  useEffect(() => {
    let cancelled = false;

    const startGame = (room: Room<PlaygroundState>) => {
      if (phaserGameRef.current) return;

      console.log("[colyseus] joined", room.roomId, "session", room.sessionId);
      phaserGameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: "100%",
        height: "100%",
        pixelArt: true,
        render: {
          pixelArt: true,
          antialias: false,
          roundPixels: true,
        },
        parent: gameRef.current || undefined,
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
      setTimeout(focusGame, 100);
      setFocusGame(() => focusGame);
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
        phaserGameRef.current?.input?.keyboard &&
          (phaserGameRef.current.input.keyboard.enabled = enabled);
      });
    };

    const spawnBots = async () => {
      const bots = botCount;
      if (bots <= 0) return;
      try {
        const cleanups = await Promise.all(Array.from({ length: bots }, () => startBot()));
        if (!cancelled) {
          botCleanupRef.current = cleanups;
          console.log("[bot] started", bots);
        } else {
          cleanups.forEach((fn) => fn());
        }
      } catch (botErr) {
        console.warn("Bot spawn failed", botErr);
      }
    };

    const connect = async () => {
      try {
        const client = new Client(resolveServerUrl());
        const identity = buildIdentity();
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
        void spawnBots();
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
      botCleanupRef.current.forEach((fn) => fn());
      botCleanupRef.current = [];
      phaserGameRef.current?.destroy(true);
      phaserGameRef.current = null;
      setKeyboardToggle(undefined);
    };
  }, [botCount, skin, userId]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-red-200 bg-slate-900">
        {error}
      </div>
    );
  }

  return (
    <React.Fragment>
      <div id="phaser-game-container" ref={gameRef} style={{ width: "100%", height: "100%" }} />
    </React.Fragment>
  );
};
