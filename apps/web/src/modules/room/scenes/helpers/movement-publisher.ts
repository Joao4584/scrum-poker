import * as Phaser from "phaser";
import type { Room } from "colyseus.js";
import type { PlaygroundState } from "../../@types/player";
import { Player } from "@/modules/shared/config/phaser-js/sprites/Player";

type RoomGetter = () => Room<PlaygroundState> | undefined;

// Centraliza o envio de movimento do jogador local para a room,
// com throttling para reduzir trafego de rede.
export class MovementPublisher {
  private lastSentAt = 0;
  private lastSentPosition = new Phaser.Math.Vector2(0, 0);

  constructor(
    private getRoom: RoomGetter,
    private player: Player,
  ) {}

  // Envia a posicao inicial apos spawn e sincroniza cache interno de posicao.
  public syncInitialPosition(spawn: Phaser.Math.Vector2) {
    this.lastSentPosition.set(spawn.x, spawn.y);
    const room = this.getRoom();
    if (!room) return;
    room.send("move", { x: spawn.x, y: spawn.y });
  }

  // Alinha o cache com a posicao atual do player sem enviar evento.
  public syncWithCurrentPosition() {
    this.lastSentPosition.set(this.player.x, this.player.y);
  }

  // Publica atualizacao de posicao/direcao apenas quando necessario.
  public publish(now: number) {
    const room = this.getRoom();
    if (!room) return;

    const moved = Phaser.Math.Distance.Between(this.lastSentPosition.x, this.lastSentPosition.y, this.player.x, this.player.y) > 1;
    const moving = this.player.isMoving();
    const shouldSend = moved || (!moving && now - this.lastSentAt > 150);
    if (!shouldSend || now - this.lastSentAt < 20) return;

    room.send("move", {
      x: this.player.x,
      y: this.player.y,
      dir: this.player.getDirection(),
      run: this.player.isSprinting(),
    });
    this.lastSentAt = now;
    this.lastSentPosition.set(this.player.x, this.player.y);
  }
}
