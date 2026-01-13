import type { MapSchema, Schema } from "@colyseus/schema";

export interface PlayerState extends Schema {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  dir: "up" | "down" | "left" | "right";
  running: boolean;
  skin: string;
  message: string;
}

export interface PlaygroundState extends Schema {
  players: MapSchema<PlayerState>;
}
