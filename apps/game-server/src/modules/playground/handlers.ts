import type { Client, Room } from "@colyseus/core";
import { Player, PlaygroundState } from "./state";
import { sanitizeColor, sanitizeId, sanitizeMessage, sanitizeName, sanitizeSkin } from "./validators";

export type PlaygroundJoinOptions = {
  name?: string;
  color?: string;
  id?: string;
  skin?: string;
};

const directions = new Set(["up", "down", "left", "right"]);
const messageTtlMs = 15000;

function getSpawnPosition() {
  // Random spawn within a safe box of the map (approx 960x640)
  const minX = 80;
  const maxX = 880;
  const minY = 80;
  const maxY = 560;
  const x = Math.round(Math.random() * (maxX - minX) + minX);
  const y = Math.round(Math.random() * (maxY - minY) + minY);
  return { x, y };
}

export function registerPlaygroundMessageHandlers(room: Room<PlaygroundState>, messageTimers: Map<string, any>) {
  room.onMessage("move", (client, payload: { x?: number; y?: number; dir?: string; run?: boolean }) => {
    const player = room.state.players.get(client.sessionId);
    if (!player) return;

    const nextX = typeof payload?.x === "number" && Number.isFinite(payload.x) ? payload.x : player.x;
    const nextY = typeof payload?.y === "number" && Number.isFinite(payload.y) ? payload.y : player.y;

    player.x = nextX;
    player.y = nextY;
    if (payload?.dir && directions.has(payload.dir)) {
      player.dir = payload.dir;
    }
    player.running = !!payload?.run;
  });

  room.onMessage("rename", (client, payload: { name?: string }) => {
    const player = room.state.players.get(client.sessionId);
    if (!player) return;
    player.name = sanitizeName(payload?.name, player.name);
  });

  room.onMessage("chat", (client, payload: { text?: string }) => {
    const player = room.state.players.get(client.sessionId);
    if (!player) return;
    const text = sanitizeMessage(payload?.text);
    if (!text) return;

    player.message = text;

    const prev = messageTimers.get(client.sessionId);
    if (prev) {
      room.clock.clear(prev);
    }

    const timer = room.clock.setTimeout(messageTtlMs, () => {
      const current = room.state.players.get(client.sessionId);
      if (current) {
        current.message = "";
      }
      messageTimers.delete(client.sessionId);
    });
    messageTimers.set(client.sessionId, timer);
  });

  room.onMessage("ping", (client, payload: { sentAt?: number }) => {
    const sentAt = typeof payload?.sentAt === "number" ? payload.sentAt : Date.now();
    client.send("pong", { sentAt });
  });
}

export function handlePlaygroundJoin(room: Room<PlaygroundState>, client: Client, options: PlaygroundJoinOptions) {
  const player = new Player();
  const fallbackName = `Guest-${client.sessionId.slice(0, 4)}`;
  const { x, y } = getSpawnPosition();

  player.id = sanitizeId(options?.id, client.sessionId);
  player.name = sanitizeName(options?.name, fallbackName);
  player.color = sanitizeColor(options?.color);
  player.x = x;
  player.y = y;
  player.dir = "down";
  player.running = false;
  player.skin = sanitizeSkin(options?.skin);

  room.state.players.set(client.sessionId, player);
  console.log(
    "[playground] join",
    room.roomId,
    client.sessionId,
    "publicId:",
    player.id,
    "name:",
    player.name,
    "pos:",
    x,
    y,
  );
}

export function handlePlaygroundLeave(room: Room<PlaygroundState>, client: Client, messageTimers: Map<string, any>) {
  const timer = messageTimers.get(client.sessionId);
  if (timer) {
    room.clock.clear(timer);
    messageTimers.delete(client.sessionId);
  }
  room.state.players.delete(client.sessionId);
  console.log("[playground] leave", room.roomId, client.sessionId);
}

export function handlePlaygroundDispose(
  room: Room<PlaygroundState>,
  messageTimers: Map<string, any>,
  debugInterval?: any,
) {
  messageTimers.forEach((timer) => room.clock.clear(timer));
  messageTimers.clear();
  if (debugInterval) {
    room.clock.clear(debugInterval);
  }
  console.log("[playground] room disposed", room.roomId);
}
