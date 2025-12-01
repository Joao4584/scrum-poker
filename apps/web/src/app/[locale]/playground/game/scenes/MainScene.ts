import * as Phaser from "phaser";
import { Player } from "../sprites/Player";
import { MapManager } from "../map/MapManager";
import type { Room } from "colyseus.js";
import type { PlaygroundState } from "../network/types";
import { RemoteManager } from "./helpers/remote-manager";
import { createNameLabel, positionLabel } from "./helpers/labels";

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

    const { width: gameWidth, height: gameHeight } = this.scale;
    const mapWidth = bounds.width;
    const mapHeight = bounds.height;

    const zoomX = gameWidth / mapWidth;
    const zoomY = gameHeight / mapHeight;
    const fitZoom = Math.max(zoomX, zoomY);
    const zoom = Phaser.Math.Clamp(fitZoom * 1.25, 0.3, 2);

    this.cameras.main.setZoom(zoom);

    this.syncInitialPosition(localSpawn);
    this.remotes = new RemoteManager(
      this,
      (x, y) => this.coerceToWalkable(x, y, this.fallbackSpawn),
      this.fallbackSpawn,
    );
    this.registerNetworkListeners();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.remotes?.destroy();
      this.room = undefined;
      this.room?.leave();
    });
  }

  update() {
    this.player.update();
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

    if (!this.room) return;

    const now = this.time.now;
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
