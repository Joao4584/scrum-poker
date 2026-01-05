import { Room, Client } from "@colyseus/core";
import { Player, State } from "./state";

export class SimpleRoom extends Room<State> {
  onCreate(options: any) {
    this.setState(new State());

    this.onMessage("move", (client, input) => {
      const player = this.state.players.get(client.sessionId);
      if (!player || typeof input?.x !== "number" || typeof input?.y !== "number") {
        return;
      }
      player.x = input.x;
      player.y = input.y;
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    const player = new Player();
    player.x = Math.random() * 800;
    player.y = Math.random() * 600;
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
