import { Room, Client } from "@colyseus/core";
import { MapSchema, Schema, type } from "@colyseus/schema";

class Player extends Schema {
  @type("string") id: string = "";
  @type("string") name: string = "";
  @type("string") color: string = "#ffffff";
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("string") dir: string = "down";
  @type("boolean") running: boolean = false;
  @type("string") skin: string = "steve";
  @type("string") message: string = "";
}

class PlaygroundState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}

function sanitizeColor(color?: string | null, fallback = "#27c498") {
  if (!color || typeof color !== "string") return fallback;
  const match = color.match(/^#?[0-9a-fA-F]{6}$/);
  if (!match) return fallback;
  return color.startsWith("#") ? color : `#${color}`;
}

function sanitizeName(name?: string | null, fallback: string) {
  if (!name) return fallback;
  const trimmed = name.toString().trim().slice(0, 32);
  return trimmed || fallback;
}

function sanitizeId(id?: string | null, fallback: string) {
  if (!id) return fallback;
  return id.toString().slice(0, 32);
}

const allowedSkins = ["steve", "jerry", "mark", "sarah"];
function sanitizeSkin(skin?: string | null) {
  if (!skin) return "steve";
  const value = skin.toString().toLowerCase();
  if (allowedSkins.includes(value)) return value;
  return "steve";
}

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

const directions = new Set(["up", "down", "left", "right"]);

export class PlaygroundRoom extends Room<PlaygroundState> {
  maxClients = 16;
  private debugInterval?: any;
  private messageTimers = new Map<string, any>();

  onCreate() {
    this.setState(new PlaygroundState());
    this.setPatchRate(50);
    console.log("[playground] room created", this.roomId);

    this.debugInterval = this.clock.setInterval(() => {
      const snapshot = Array.from(this.state.players.entries()).map(([sessionId, p]) => ({
        sessionId,
        id: p.id,
        name: p.name,
        x: p.x,
        y: p.y,
      }));
      console.log("[playground] positions", this.roomId, snapshot);
    }, 10000);

    this.onMessage(
      "move",
      (client, payload: { x?: number; y?: number; dir?: string; run?: boolean }) => {
        const player = this.state.players.get(client.sessionId);
        if (!player) return;

        const prevX = player.x;
        const prevY = player.y;
        const nextX =
          typeof payload?.x === "number" && Number.isFinite(payload.x) ? payload.x : player.x;
        const nextY =
          typeof payload?.y === "number" && Number.isFinite(payload.y) ? payload.y : player.y;

        player.x = nextX;
        player.y = nextY;
        if (payload?.dir && directions.has(payload.dir)) {
          player.dir = payload.dir;
        }
        player.running = !!payload?.run;
      },
    );

    this.onMessage("rename", (client, payload: { name?: string }) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      player.name = sanitizeName(payload?.name, player.name);
    });

    this.onMessage("chat", (client, payload: { text?: string }) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      const text = this.sanitizeMessage(payload?.text);
      if (!text) return;

      player.message = text;

      const prev = this.messageTimers.get(client.sessionId);
      if (prev) {
        this.clock.clear(prev);
      }

      const ttlMs = 15000;
      const timer = this.clock.setTimeout(ttlMs, () => {
        const current = this.state.players.get(client.sessionId);
        if (current) {
          current.message = "";
        }
        this.messageTimers.delete(client.sessionId);
      });
      this.messageTimers.set(client.sessionId, timer);
    });
  }

  onJoin(client: Client, options: { name?: string; color?: string; id?: string; skin?: string }) {
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

    this.state.players.set(client.sessionId, player);
    console.log(
      "[playground] join",
      this.roomId,
      client.sessionId,
      "userId:",
      player.id,
      "name:",
      player.name,
      "pos:",
      x,
      y,
    );
  }

  onLeave(client: Client) {
    const timer = this.messageTimers.get(client.sessionId);
    if (timer) {
      this.clock.clear(timer);
      this.messageTimers.delete(client.sessionId);
    }
    this.state.players.delete(client.sessionId);
    console.log("[playground] leave", this.roomId, client.sessionId);
  }

  onDispose() {
    this.messageTimers.forEach((timer) => this.clock.clear(timer));
    this.messageTimers.clear();
    if (this.debugInterval) {
      this.clock.clear(this.debugInterval);
      this.debugInterval = undefined;
    }
    console.log("[playground] room disposed", this.roomId);
  }

  private sanitizeMessage(raw?: string | null) {
    if (!raw || typeof raw !== "string") return "";
    const cleaned = raw.replace(/[\r\n\t]+/g, " ").trim();
    if (!cleaned) return "";
    return cleaned.slice(0, 120);
  }
}
