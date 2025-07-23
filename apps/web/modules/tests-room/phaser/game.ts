import * as Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'phaser-game-container',
  scene: [MainScene],
  backgroundColor: '#2d2d2d',
};

const createGame = () => {
  return new Phaser.Game(config);
};

export default createGame;
