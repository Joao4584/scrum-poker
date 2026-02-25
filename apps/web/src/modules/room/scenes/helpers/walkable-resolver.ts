import * as Phaser from "phaser";
import { MapManager } from "@/modules/shared/config/phaser-js/map/MapManager";

type TileLayer = Phaser.Tilemaps.TilemapLayer | null | undefined;

// Resolve coordenadas validas de spawn/movimento para tiles caminhaveis no mapa.
export class WalkableResolver {
  constructor(
    private floorLayer: TileLayer,
    private colliderLayer: TileLayer,
    private worldBounds: Phaser.Geom.Rectangle | undefined,
    private fallbackSpawn: Phaser.Math.Vector2,
  ) {}

  // Retorna o fallback atual usado quando nao ha tile valido.
  public getFallback() {
    return this.fallbackSpawn;
  }

  // Atualiza o fallback de spawn.
  public setFallback(fallbackSpawn: Phaser.Math.Vector2) {
    this.fallbackSpawn = fallbackSpawn;
  }

  // Garante uma posicao caminhavel a partir das coordenadas recebidas.
  public coerce(x: number | undefined, y: number | undefined, fallback?: Phaser.Math.Vector2) {
    const defaultFallback =
      fallback ??
      this.fallbackSpawn ??
      MapManager.findSpawnOnFloor(this.floorLayer, this.colliderLayer) ??
      new Phaser.Math.Vector2(0, 0);

    if (typeof x !== "number" || typeof y !== "number") {
      return defaultFallback;
    }

    const snapped = this.findNearestWalkable(x, y);
    return snapped ?? defaultFallback;
  }

  // Busca o tile caminhavel mais proximo dentro de um raio maximo.
  public findNearestWalkable(worldX: number, worldY: number) {
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
}
