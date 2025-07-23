import { Schema, MapSchema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") x: number;
  @type("number") y: number;
}

export class State extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
