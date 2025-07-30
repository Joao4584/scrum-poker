import * as Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 700,
  height: 600,
  parent: 'phaser-game-container',
  scene: [GameScene],
  backgroundColor: '#2d2d2d',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
};

const createGame = () => {
  return new Phaser.Game(config);
};

export default createGame;
