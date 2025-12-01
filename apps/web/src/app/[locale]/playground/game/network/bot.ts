import { Client, type Room } from "colyseus.js";
import type { PlaygroundState } from "./types";

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
  return `Bot-${Math.floor(Math.random() * 9_000 + 1_000)}`;
}

export async function startBot(): Promise<() => void> {
  const client = new Client(resolveServerUrl());
  const room = await client.joinOrCreate<PlaygroundState>("playground", {
    name: randomName(),
    color: "#7dd3fc",
  });

  const move = () => {
    const self = room.state.players.get(room.sessionId);
    if (!self) return;

    const radius = 80;
    const angle = Math.random() * Math.PI * 2;
    const dx = Math.cos(angle) * radius;
    const dy = Math.sin(angle) * radius;

    room.send("move", {
      x: self.x + dx,
      y: self.y + dy,
    });
  };

  const interval = setInterval(move, 750);

  const cleanup = () => {
    clearInterval(interval);
    void room.leave();
  };

  return cleanup;
}
