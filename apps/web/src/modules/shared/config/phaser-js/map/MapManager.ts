import * as Phaser from "phaser";

export class MapManager {
  public static createMap(scene: Phaser.Scene) {
    const map = scene.make.tilemap({ key: "wall-room" });

    map.addTilesetImage("block_builder_32x32", "block_builder_32x32", 32, 32);
    map.addTilesetImage("room_wall_32x32", "room_wall_32x32", 32, 32);
    map.addTilesetImage("Interiors_32x32", "Interiors_32x32", 32, 32);

    const allTilesets = map.tilesets.filter((tileset) => Boolean(tileset.image));

    const createIfExists = (names: string[]) => {
      for (const name of names) {
        const idx = map.getLayerIndex(name);
        if (idx === null || idx === -1) continue;
        return map.createLayer(name, allTilesets, 0, 0);
      }
      return null;
    };

    const floorLayer = createIfExists(["floor"]);
    const wallLayer = createIfExists(["wall"]);
    const wallTopLayer = createIfExists(["wall-top"]);
    const blocksLayer = createIfExists(["blocks"]);

    const alignLayerByName = (
      layer: Phaser.Tilemaps.TilemapLayer | null,
      layerName: string,
      targetName: string,
    ) => {
      if (!layer) return;
      const layerData = map.getLayer(layerName);
      const targetData = map.getLayer(targetName);
      if (!layerData || !targetData) return;
      const deltaX = (layerData.startX - targetData.startX) * map.tileWidth;
      const deltaY = (layerData.startY - targetData.startY) * map.tileHeight;
      if (deltaX !== 0 || deltaY !== 0) {
        layer.setPosition(deltaX, deltaY);
      }
    };

    alignLayerByName(wallTopLayer, "wall-top", "wall");
    alignLayerByName(wallTopLayer, "wall-top", "wall");

    floorLayer?.setDepth(0);
    wallLayer?.setDepth(1);
    blocksLayer?.setDepth(3);
    const overlayBaseDepth = 10000;
    wallTopLayer?.setDepth(overlayBaseDepth);

    const cullPad = 4;
    const layers = [floorLayer, wallLayer, wallTopLayer, blocksLayer];
    const normalizeLayer = (layer: Phaser.Tilemaps.TilemapLayer | null) => {
      if (!layer) return;
      layer.setScrollFactor(1, 1);
      layer.setOrigin(0, 0);
      layer.setPosition(0, 0);
      if (layer.layer) {
        layer.layer.parallaxX = 1;
        layer.layer.parallaxY = 1;
        layer.layer.x = 0;
        layer.layer.y = 0;
      }
    };
    layers.forEach((layer) => normalizeLayer(layer));
    layers.forEach((layer) => layer?.setCullPadding(cullPad, cullPad));
    // Avoid aggressive culling to prevent edge seams
    layers.forEach((layer) => layer?.setSkipCull(true));

    const collider = createIfExists(["collider", "objects/collider"]);
    collider?.setCollisionByExclusion([-1]);
    collider?.setVisible(false);

    return {
      map,
      colliderLayer: collider,
      floorLayer,
      wallLayer,
      wallTopLayer,
      blocksLayer,
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

  public static findSpawnOnFloor(floorLayer: Phaser.Tilemaps.TilemapLayer | null | undefined, colliderLayer?: Phaser.Tilemaps.TilemapLayer | null) {
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
      return new Phaser.Math.Vector2(floorLayer.tilemap.widthInPixels / 2, floorLayer.tilemap.heightInPixels / 2);
    }

    const selectedTile = Phaser.Utils.Array.GetRandom(walkableTiles);
    const x = floorLayer.tilemap.tileToWorldX(selectedTile.x) + floorLayer.tilemap.tileWidth / 2;
    const y = floorLayer.tilemap.tileToWorldY(selectedTile.y) + floorLayer.tilemap.tileHeight / 2;

    return new Phaser.Math.Vector2(x, y);
  }
}
