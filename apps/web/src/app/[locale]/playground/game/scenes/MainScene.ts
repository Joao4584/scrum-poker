import * as Phaser from "phaser";
import { Player } from "../sprites/Player";
import { MapManager } from "../map/MapManager";
import type { Room } from "colyseus.js";
import type { PlaygroundState } from "../network/types";
import {
  CHAT_HIDE_DELAY_MS,
  sanitizeChatMessage,
} from "../chat-config";
import { RemoteManager } from "./helpers/remote-manager";
import { createNameLabel, positionLabel } from "./helpers/labels";
import {
  ChatBubble,
  createChatBubble,
  destroyChatBubble,
  positionChatBubble,
  updateChatBubble,
} from "./helpers/chat-bubble";

export class MainScene extends Phaser.Scene {
  private player!: Player;
  private room?: Room<PlaygroundState>;
  private lastSentAt = 0;
  private lastSentPosition = new Phaser.Math.Vector2(0, 0);
  private floorLayer?: Phaser.Tilemaps.TilemapLayer | null;
  private colliderLayer?: Phaser.Tilemaps.TilemapLayer | null;
  private worldBounds?: Phaser.Geom.Rectangle;
  private fallbackSpawn?: Phaser.Math.Vector2;
  private selfInitialized = false;
  private selfLabel?: Phaser.GameObjects.Text;
  private remotes?: RemoteManager;
  private selfBubble?: ChatBubble;
  private selfMessageSeenAt = 0;
  private selfStateMessage = "";
  private hiddenMessage?: string;

  constructor() {
    super({ key: "game" });
  }

  init(data: { room?: Room<PlaygroundState> }) {
    this.room = data.room;
  }

  create() {
    const { map, colliderLayer, floorLayer, wallLayer, wallTopLayer } = MapManager.createMap(this);
    this.floorLayer = floorLayer;
    this.colliderLayer = colliderLayer;

    this.worldBounds = MapManager.getWorldBounds(
      map,
      [floorLayer, colliderLayer, wallLayer, wallTopLayer],
      4,
    );

    const center = new Phaser.Math.Vector2(map.widthInPixels / 2, map.heightInPixels / 2);
    const spawnFromMap =
      MapManager.findSpawnOnFloor(floorLayer, colliderLayer) ??
      this.findNearestWalkable(center.x, center.y) ??
      center;
    this.fallbackSpawn = spawnFromMap;

    const roomSpawn = this.getSpawnFromRoom();
    const localSpawn = this.coerceToWalkable(roomSpawn?.x, roomSpawn?.y, this.fallbackSpawn);

    const bounds =
      this.worldBounds ??
      new Phaser.Geom.Rectangle(0, 0, map.widthInPixels ?? 0, map.heightInPixels ?? 0);

    const localSkin =
      this.room?.state.players.get(this.room?.sessionId ?? "")?.skin?.toString() ?? "steve";
    this.player = new Player(this, localSpawn.x, localSpawn.y, localSkin);
    this.player.setDepth(localSpawn.y);

    this.physics.world.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);

    if (colliderLayer) {
      this.physics.add.collider(this.player, colliderLayer);
    }

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
    this.cameras.main.roundPixels = true;
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setBackgroundColor("#0b1220");

    const { width: gameWidth, height: gameHeight } = this.scale;
    const mapWidth = bounds.width;
    const mapHeight = bounds.height;

    const zoomX = gameWidth / mapWidth;
    const zoomY = gameHeight / mapHeight;
    const fitZoom = Math.max(zoomX, zoomY);
    const rawZoom = Phaser.Math.Clamp(fitZoom * 1.25, 0.4, 2);
    // Snap zoom to quarter steps to avoid subpixel gaps between tiles
    const zoom = Math.max(0.5, Math.round(rawZoom * 4) / 4);

    this.cameras.main.setZoom(zoom);

    this.syncInitialPosition(localSpawn);
    this.remotes = new RemoteManager(
      this,
      (x, y) => this.coerceToWalkable(x, y, this.fallbackSpawn),
      this.fallbackSpawn,
    );
    this.registerNetworkListeners();
    this.selfBubble = createChatBubble(this, "", localSpawn.x, localSpawn.y);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.remotes?.destroy();
      this.room = undefined;
      this.room?.leave();
      if (this.selfBubble) {
        destroyChatBubble(this.selfBubble);
        this.selfBubble = undefined;
      }
    });
  }

  update() {
    this.player.update();
    const now = this.time.now;
    const cam = this.cameras.main;
    // Snap camera scroll to whole pixels to avoid tile seams near edges
    cam.setScroll(Math.round(cam.scrollX), Math.round(cam.scrollY));
    // depth based on y to simulate layering
    this.player.setDepth(this.player.y);
    if (this.selfLabel) {
      positionLabel(this.selfLabel, this.player.x, this.player.y);
      const selfState = this.room?.state.players.get(this.room?.sessionId ?? "");
      if (selfState && selfState.name && selfState.name !== this.selfLabel.text) {
        this.selfLabel.setText(selfState.name);
      }
      this.selfLabel.setDepth(this.player.y + 1);
    }
    const selfState = this.room?.state.players.get(this.room?.sessionId ?? "");
    const nextMessage = sanitizeChatMessage(selfState?.message ?? "");
    if (this.selfBubble) {
      positionChatBubble(this.selfBubble, this.player.x, this.player.y);
      const changed = nextMessage !== this.selfStateMessage;
      const hiddenSame = this.hiddenMessage !== undefined && nextMessage === this.hiddenMessage;

      if (!hiddenSame) {
        if (changed) {
          this.selfStateMessage = nextMessage;
          this.selfMessageSeenAt = nextMessage ? now : 0;
          this.hiddenMessage = undefined;
          updateChatBubble(this.selfBubble, nextMessage);
        } else if (this.selfStateMessage) {
          if (this.selfMessageSeenAt && now - this.selfMessageSeenAt > CHAT_HIDE_DELAY_MS) {
            this.hiddenMessage = this.selfStateMessage;
            this.selfMessageSeenAt = 0;
            updateChatBubble(this.selfBubble, "");
          }
        }
      }
    }

    if (!this.room) return;

    const moved =
      Phaser.Math.Distance.Between(
        this.lastSentPosition.x,
        this.lastSentPosition.y,
        this.player.x,
        this.player.y,
      ) > 1;

    const moving = this.player.isMoving();
    const shouldSend = moved || (!moving && now - this.lastSentAt > 150);
    if (!shouldSend || now - this.lastSentAt < 20) return;

    this.room.send("move", {
      x: this.player.x,
      y: this.player.y,
      dir: this.player.getDirection(),
      run: this.player.isSprinting(),
    });
    this.lastSentAt = now;
    this.lastSentPosition.set(this.player.x, this.player.y);
  }

  private getSpawnFromRoom() {
    if (!this.room) return undefined;
    const player = this.room.state.players.get(this.room.sessionId);
    if (!player) return undefined;
    return new Phaser.Math.Vector2(player.x ?? 0, player.y ?? 0);
  }

  private syncInitialPosition(spawn: Phaser.Math.Vector2) {
    this.lastSentPosition.set(spawn.x, spawn.y);
    if (!this.room) return;
    this.room.send("move", { x: spawn.x, y: spawn.y });
  }

  private coerceToWalkable(
    x: number | undefined,
    y: number | undefined,
    fallback?: Phaser.Math.Vector2,
  ) {
    const fb =
      fallback ??
      this.fallbackSpawn ??
      MapManager.findSpawnOnFloor(this.floorLayer, this.colliderLayer) ??
      new Phaser.Math.Vector2(0, 0);

    if (typeof x !== "number" || typeof y !== "number") {
      return fb;
    }

    const snapped = this.findNearestWalkable(x, y);
    return snapped ?? fb;
  }

  private findNearestWalkable(worldX: number, worldY: number) {
    if (!this.floorLayer) return undefined;

    const tilemap = this.floorLayer.tilemap;
    const startX = tilemap.worldToTileX(worldX);
    const startY = tilemap.worldToTileY(worldY);
    const maxRadius = 8;

    for (let r = 0; r <= maxRadius; r++) {
      for (let dx = -r; dx <= r; dx++) {
        for (let dy = -r; dy <= r; dy++) {
          const tx = startX + dx;
          const ty = startY + dy;
          const floorTile = this.floorLayer.getTileAt(tx, ty);
          if (!floorTile || floorTile.index === -1) continue;
          if (this.colliderLayer) {
            const colTile = this.colliderLayer.getTileAt(tx, ty);
            if (colTile?.collides) continue;
          }
          const wx = tilemap.tileToWorldX(tx) + tilemap.tileWidth / 2;
          const wy = tilemap.tileToWorldY(ty) + tilemap.tileHeight / 2;
          if (this.worldBounds && !this.worldBounds.contains(wx, wy)) {
            continue;
          }
          return new Phaser.Math.Vector2(wx, wy);
        }
      }
    }
    return undefined;
  }

  private registerNetworkListeners() {
    const room = this.room;
    if (!room) return;

    const selfId = room.sessionId;

    room.state.players.onAdd = (player, sessionId) => {
      if (sessionId === selfId) {
        if (!this.selfInitialized) {
          this.player.setPosition(player.x ?? this.player.x, player.y ?? this.player.y);
          const tint = Phaser.Display.Color.HexStringToColor(player.color ?? "#ffffff");
          this.player.setTint(tint.color);
          this.lastSentPosition.set(this.player.x, this.player.y);
          this.selfInitialized = true;
        }
        return;
      }

      this.remotes?.addOrUpdate(player, sessionId, selfId);
    };

    const materializeAll = () => this.remotes?.materializeAll(room, selfId);
    const prune = () => this.remotes?.prune(room, selfId);

    materializeAll();

    room.state.players.onChange = (player, sessionId) => {
      if (sessionId === selfId) return;
      this.remotes?.updateRemoteSprite(sessionId, player);
    };

    room.onStateChange(() => {
      materializeAll();
      prune();
    });

    room.state.players.onRemove = (_, sessionId) => {
      this.remotes?.remove(sessionId);
      if (sessionId === selfId) {
        this.room?.leave();
      }
    };
  }
}
