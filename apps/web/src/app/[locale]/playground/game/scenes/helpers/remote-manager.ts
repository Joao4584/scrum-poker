import * as Phaser from "phaser";
import type { Room } from "colyseus.js";
import type { PlaygroundState } from "../../network/types";
import { createNameLabel, positionLabel } from "./labels";

type CoerceFn = (x: number | undefined, y: number | undefined) => Phaser.Math.Vector2;

export class RemoteManager {
  private sprites = new Map<string, Phaser.GameObjects.Sprite>();
  private labels = new Map<string, Phaser.GameObjects.Text>();
  private listeners = new Map<string, { cleanup?: () => void }>();
  private skins = new Map<string, string>();

  constructor(
    private scene: Phaser.Scene,
    private coerce: CoerceFn,
    private fallbackSpawn: Phaser.Math.Vector2,
  ) {}

  addOrUpdate(player: any, sessionId: string, selfId: string) {
    if (sessionId === selfId) return;

    if (this.sprites.has(sessionId)) {
      this.updateRemoteSprite(sessionId, player);
      return;
    }

    const skin = (player.skin ?? "steve").toString();
    const spawn = this.coerce(player.x, player.y) ?? this.fallbackSpawn;
    const sprite = this.scene.physics.add.sprite(spawn.x, spawn.y, `${skin}-walk`);
    sprite.setDepth(spawn.y);
    this.setRemoteAnimation(sprite, player.dir, false, !!player.running, skin);
    this.sprites.set(sessionId, sprite);
    this.skins.set(sessionId, skin);

    const label = createNameLabel(this.scene, player.name ?? "Player", spawn.x, spawn.y);
    label.setDepth(spawn.y + 1);
    this.labels.set(sessionId, label);

    if (typeof player.onChange === "function") {
      const handler = () => this.updateRemoteSprite(sessionId, player);
      player.onChange(handler);
      this.listeners.set(sessionId, { cleanup: () => player.off?.(handler) });
    }
  }

  materializeAll(room: Room<PlaygroundState>, selfId: string) {
    room.state.players.forEach((player, sessionId) => this.addOrUpdate(player, sessionId, selfId));
  }

  prune(room: Room<PlaygroundState>, selfId: string) {
    const currentIds = new Set(room.state.players.keys());
    Array.from(this.sprites.keys()).forEach((sessionId) => {
      if (!currentIds.has(sessionId) && sessionId !== selfId) {
        this.remove(sessionId);
      }
    });
  }

  updateRemoteSprite(sessionId: string, player: any) {
    const target = this.sprites.get(sessionId);
    if (!target) return;

    const next = this.coerce(player.x, player.y) ?? this.fallbackSpawn;
    const dist = Phaser.Math.Distance.Between(target.x, target.y, next.x, next.y);
    const moving = dist > 0.2;
    const skin = this.skins.get(sessionId) ?? (player.skin ?? "steve").toString();

    if (!moving) {
      this.scene.tweens.killTweensOf(target);
      target.setPosition(next.x, next.y);
      this.setRemoteAnimation(target, player.dir, false, !!player.running, skin);
      target.setDepth(next.y);
      this.updateLabel(sessionId, target.x, target.y, player.name);
      return;
    }

    const speed = player.running ? 320 : 180;
    const duration = Phaser.Math.Clamp((dist / speed) * 1000, 30, 260);
    this.scene.tweens.killTweensOf(target);
    this.setRemoteAnimation(target, player.dir, true, !!player.running, skin);
    const label = this.labels.get(sessionId);

    this.scene.tweens.add({
      targets: target,
      x: next.x,
      y: next.y,
      duration,
      ease: "Linear",
      onUpdate: () => {
        target.setDepth(target.y);
        this.updateLabel(sessionId, target.x, target.y, player.name);
      },
      onComplete: () => {
        this.setRemoteAnimation(target, player.dir, false, !!player.running, skin);
        target.setDepth(next.y);
        this.updateLabel(sessionId, target.x, target.y, player.name);
      },
    });
  }

  remove(sessionId: string) {
    const label = this.labels.get(sessionId);
    label?.destroy();
    this.labels.delete(sessionId);

    const listener = this.listeners.get(sessionId);
    listener?.cleanup?.();
    this.listeners.delete(sessionId);

    const sprite = this.sprites.get(sessionId);
    if (sprite) {
      sprite.destroy();
      this.sprites.delete(sessionId);
    }

    this.skins.delete(sessionId);
  }

  destroy() {
    this.sprites.forEach((sprite) => sprite.destroy());
    this.sprites.clear();
    this.labels.forEach((label) => label.destroy());
    this.labels.clear();
    this.listeners.forEach((entry) => entry.cleanup?.());
    this.listeners.clear();
    this.skins.clear();
  }

  private setRemoteAnimation(
    sprite: Phaser.GameObjects.Sprite,
    dir: "up" | "down" | "left" | "right",
    moving: boolean,
    running: boolean,
    skin: string,
  ) {
    const safeDir = dir ?? "down";
    const key = moving ? `${skin}-walk-${safeDir}` : `${skin}-idle-${safeDir}`;
    if (this.scene.anims.exists(key)) {
      sprite.anims.timeScale = running ? 1.5 : 1;
      sprite.anims.play(key, true);
    }
  }

  private updateLabel(sessionId: string, x: number, y: number, name?: string) {
    const label = this.labels.get(sessionId);
    if (!label) return;
    positionLabel(label, x, y);
    if (name) {
      label.setText(name);
    }
    label.setDepth(y + 5);
  }
}
