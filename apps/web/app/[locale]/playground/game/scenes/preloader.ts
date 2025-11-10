import * as Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    // Assets do tilemap
    this.load.image('room-wall', '/tiles/room_wall_32x32.png');
    this.load.image('block_builder_32x32', '/tiles/block_builder_32x32.png');
    this.load.tilemapTiledJSON('wall-room', '/tiles/wall-room.json');
  }

  create() {
    this.scene.start('game');
  }
}
