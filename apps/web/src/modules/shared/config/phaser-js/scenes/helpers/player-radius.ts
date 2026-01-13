import * as Phaser from "phaser";

export type PlayerRadius = {
  graphics: Phaser.GameObjects.Graphics;
  radius: number;
};

export const PLAYER_RADIUS_DEFAULT = 120;
export const PLAYER_RADIUS_Y_SCALE = 0.6;
export const PLAYER_RADIUS_Y_OFFSET = 10;
const FILL_COLOR = 0x38bdf8;
const FILL_ALPHA = 0.14;
const STROKE_COLOR = 0x0ea5e9;
const STROKE_ALPHA = 0.6;
const STROKE_WIDTH = 2;
const Y_OFFSET = 10;

export function createPlayerRadius(scene: Phaser.Scene, radius = PLAYER_RADIUS_DEFAULT): PlayerRadius {
  const graphics = scene.add.graphics();
  graphics.setScrollFactor(1, 1);
  drawRadius(graphics, radius);
  graphics.setVisible(false);
  return { graphics, radius };
}

export function positionPlayerRadius(radius: PlayerRadius, x: number, y: number) {
  radius.graphics.setPosition(Math.round(x), Math.round(y + PLAYER_RADIUS_Y_OFFSET));
  radius.graphics.setDepth(Math.round(y + PLAYER_RADIUS_Y_OFFSET) - 1);
}

export function togglePlayerRadius(radius: PlayerRadius, visible?: boolean) {
  const next = visible ?? !radius.graphics.visible;
  radius.graphics.setVisible(next);
}

export function destroyPlayerRadius(radius: PlayerRadius) {
  radius.graphics.destroy();
}

function drawRadius(graphics: Phaser.GameObjects.Graphics, radius: number) {
  const width = radius * 2;
  const height = radius * 2 * PLAYER_RADIUS_Y_SCALE;
  graphics.clear();
  graphics.fillStyle(FILL_COLOR, FILL_ALPHA);
  graphics.fillEllipse(0, 0, width, height);
  graphics.lineStyle(STROKE_WIDTH, STROKE_COLOR, STROKE_ALPHA);
  graphics.strokeEllipse(0, 0, width, height);
}
