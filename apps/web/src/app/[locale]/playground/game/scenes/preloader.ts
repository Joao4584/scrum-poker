import * as Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image("room-wall", "/tiles/room_wall_32x32.png");
    this.load.image("block_builder_32x32", "/tiles/block_builder_32x32.png");
    this.load.tilemapTiledJSON("wall-room", "/tiles/wall-room.json");

    this.load.spritesheet(
      "main_sprite",
      "/sprites/steve_32x32/steve_walk.png",
      {
        frameWidth: 32,
        frameHeight: 64,
      },
    );

    this.load.spritesheet(
      "main_idle_sprite",
      "/sprites/steve_32x32/steve_idle.png",
      {
        frameWidth: 32,
        frameHeight: 64,
      },
    );
  }

  create() {
    this.scene.start("game");
  }
}
