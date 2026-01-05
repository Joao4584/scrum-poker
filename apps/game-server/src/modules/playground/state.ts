import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
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

export class PlaygroundState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
