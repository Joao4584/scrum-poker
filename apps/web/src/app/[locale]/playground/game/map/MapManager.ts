import * as Phaser from "phaser";

export class MapManager {
  public static createMap(scene: Phaser.Scene) {
    const map = scene.make.tilemap({ key: "wall-room" });

    const tileset1 = map.addTilesetImage("room-wall", "room-wall", 32, 32);
    const tileset2 = map.addTilesetImage("block_builder_32x32", "block_builder_32x32", 32, 32);

    const allTilesets = [tileset1, tileset2].filter(Boolean) as Phaser.Tilemaps.Tileset[];

    const createIfExists = (name: string) => {
      const idx = map.getLayerIndex(name);
      if (idx === null || idx === -1) return null;
      return map.createLayer(name, allTilesets, 0, 0);
    };

    const floorLayer = createIfExists("floor");
    const wallLayer = createIfExists("wall/wall");
    const wallTopLayer = createIfExists("wall/wall-top");

    floorLayer?.setDepth(0);
    wallLayer?.setDepth(1);
    wallTopLayer?.setDepth(1 * 9999);

    const cullPad = 2;
    floorLayer?.setCullPadding(cullPad, cullPad);
    wallLayer?.setCullPadding(cullPad, cullPad);
    wallTopLayer?.setCullPadding(cullPad, cullPad);

    const collider = createIfExists("collider");
    collider?.setCollisionByExclusion([-1]);
    collider?.setVisible(false);

    return {
      map,
      colliderLayer: collider,
      floorLayer,
      wallLayer,
      wallTopLayer,
    };
  }

  public static getWorldBounds(
    map: Phaser.Tilemaps.Tilemap,
    layers: (Phaser.Tilemaps.TilemapLayer | null | undefined)[],
    paddingTiles = 4,
  ): Phaser.Geom.Rectangle {
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    layers.forEach((layer) => {
      layer?.forEachTile((tile) => {
        if (tile.index === -1) return;

        minX = Math.min(minX, tile.x);
        minY = Math.min(minY, tile.y);
        maxX = Math.max(maxX, tile.x);
        maxY = Math.max(maxY, tile.y);
      });
    });

    if (minX === Number.POSITIVE_INFINITY) {
      minX = 0;
      minY = 0;
      maxX = map.width - 1;
      maxY = map.height - 1;
    }

    const x = map.tileToWorldX(minX);
    const y = map.tileToWorldY(minY);
    const width = (maxX - minX + 1) * map.tileWidth;
    const height = (maxY - minY + 1) * map.tileHeight;

    const padX = paddingTiles * map.tileWidth;
    const padY = paddingTiles * map.tileHeight;

    return new Phaser.Geom.Rectangle(x - padX, y - padY, width + padX * 2, height + padY * 2);
  }

  public static findSpawnOnFloor(
    floorLayer: Phaser.Tilemaps.TilemapLayer | null | undefined,
    colliderLayer?: Phaser.Tilemaps.TilemapLayer | null,
  ) {
    if (!floorLayer) {
      return new Phaser.Math.Vector2(0, 0);
    }

    const walkableTiles: Phaser.Tilemaps.Tile[] = [];

    floorLayer.forEachTile((tile) => {
      if (tile.index === -1) {
        return;
      }

      const colliderTile = colliderLayer?.getTileAt(tile.x, tile.y);
      if (colliderTile?.collides) {
        return;
      }

      walkableTiles.push(tile);
    });

    if (!walkableTiles.length) {
      return new Phaser.Math.Vector2(
        floorLayer.tilemap.widthInPixels / 2,
        floorLayer.tilemap.heightInPixels / 2,
      );
    }

    const selectedTile = Phaser.Utils.Array.GetRandom(walkableTiles);
    const x = floorLayer.tilemap.tileToWorldX(selectedTile.x) + floorLayer.tilemap.tileWidth / 2;
    const y = floorLayer.tilemap.tileToWorldY(selectedTile.y) + floorLayer.tilemap.tileHeight / 2;

    return new Phaser.Math.Vector2(x, y);
  }
}
