import * as Phaser from "phaser";
import { Player } from "../sprites/Player";
import { MapManager } from "../map/MapManager";

export class MainScene extends Phaser.Scene {
  private player!: Player;

  constructor() {
    super({ key: "game" });
  }

  create() {
    const { map, colliderLayer, floorLayer, wallLayer, wallTopLayer } =
      MapManager.createMap(this);

    const spawnPosition = MapManager.findSpawnOnFloor(
      floorLayer,
      colliderLayer,
    );
    const worldBounds = MapManager.getWorldBounds(
      map,
      [floorLayer, colliderLayer, wallLayer, wallTopLayer],
      4,
    );

    this.player = new Player(
      this,
      spawnPosition.x,
      spawnPosition.y,
      "main_sprite",
      "main_idle_sprite",
    );
    this.player.setDepth(10);

    this.physics.world.setBounds(
      worldBounds.x,
      worldBounds.y,
      worldBounds.width,
      worldBounds.height,
    );

    if (colliderLayer) {
      this.physics.add.collider(this.player, colliderLayer);
    }

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(
      worldBounds.x,
      worldBounds.y,
      worldBounds.width,
      worldBounds.height,
    );

    const { width: gameWidth, height: gameHeight } = this.scale;
    const mapWidth = worldBounds.width;
    const mapHeight = worldBounds.height;

    const zoomX = gameWidth / mapWidth;
    const zoomY = gameHeight / mapHeight;
    const fitZoom = Math.max(zoomX, zoomY);
    const zoom = Phaser.Math.Clamp(fitZoom * 1.25, 0.3, 2);

    this.cameras.main.setZoom(zoom);
  }

  update() {
    this.player.update();
  }
}
