import { Room, Client } from "@colyseus/core";
import { PlaygroundState } from "./state";
import {
  handlePlaygroundDispose,
  handlePlaygroundJoin,
  handlePlaygroundLeave,
  registerPlaygroundMessageHandlers,
  type PlaygroundJoinOptions,
} from "./handlers";

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

    registerPlaygroundMessageHandlers(this, this.messageTimers);
  }

  onJoin(client: Client, options: PlaygroundJoinOptions) {
    handlePlaygroundJoin(this, client, options);
  }

  onLeave(client: Client) {
    handlePlaygroundLeave(this, client, this.messageTimers);
  }

  onDispose() {
    handlePlaygroundDispose(this, this.messageTimers, this.debugInterval);
    this.debugInterval = undefined;
  }
}
