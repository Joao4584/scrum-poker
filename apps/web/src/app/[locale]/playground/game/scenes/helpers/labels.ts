import * as Phaser from "phaser";

export function createNameLabel(scene: Phaser.Scene, name: string, x: number, y: number) {
  const label = scene.add.text(x, y - 28, name || "Player", {
    fontFamily: "PixelFont, monospace",
    fontSize: "12px",
    color: "#f8fafc",
    stroke: "#0f172a",
    strokeThickness: 3,
    align: "center",
    resolution: 2,
  });
  label.setOrigin(0.5, 1);
  label.setScrollFactor(1, 1);
  positionLabel(label, x, y);
  label.setDepth(y + 1);
  return label;
}

export function positionLabel(label: Phaser.GameObjects.Text, x: number, y: number) {
  label.setPosition(Math.round(x), Math.round(y - 28));
}
