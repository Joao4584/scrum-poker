import * as Phaser from "phaser";

const LABEL_OFFSET_Y = 28;
const LABEL_BASE_DEPTH = 20000;

export function createNameLabel(scene: Phaser.Scene, name: string, x: number, y: number) {
  const fontFamily = resolveGeistFontFamily();
  const label = scene.add.text(x, y - LABEL_OFFSET_Y, name || "Player", {
    fontFamily,
    fontSize: "12px",
    color: "#f8fafc",
    stroke: "#0f172a",
    strokeThickness: 2.8,
    align: "center",
    resolution: 2,
  });
  label.setOrigin(0.5, 1);
  label.setScrollFactor(1, 1);
  positionLabel(label, x, y, 0);
  return label;
}

function resolveGeistFontFamily() {
  if (typeof document === "undefined") {
    return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  }
  const geist = getComputedStyle(document.body).getPropertyValue("--font-geist-sans").trim();
  if (geist) {
    return `${geist}, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  }
  return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
}

export function positionLabel(label: Phaser.GameObjects.Text, x: number, y: number, smoothing = 0) {
  const targetX = x;
  const targetY = y - LABEL_OFFSET_Y;
  const smooth = Phaser.Math.Clamp(smoothing, 0, 1);

  const px = smooth > 0 && smooth < 1 ? Phaser.Math.Linear(label.x, targetX, smooth) : targetX;
  const py = smooth > 0 && smooth < 1 ? Phaser.Math.Linear(label.y, targetY, smooth) : targetY;

  const snapX = Math.abs(px - targetX) < 0.25 ? targetX : px;
  const snapY = Math.abs(py - targetY) < 0.25 ? targetY : py;

  label.setPosition(Math.round(snapX), Math.round(snapY));

  const depth = LABEL_BASE_DEPTH + Math.round(y);
  if (label.depth !== depth) {
    label.setDepth(depth);
  }
}
