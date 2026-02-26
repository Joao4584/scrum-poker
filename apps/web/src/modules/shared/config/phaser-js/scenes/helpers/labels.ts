import * as Phaser from "phaser";
import { getLevelTheme } from "@/modules/shared/utils/level-theme";

const LABEL_OFFSET_Y = 32;
const LABEL_BASE_DEPTH = 20000;
const LABEL_MIN_WIDTH = 64;
const LABEL_HEIGHT = 20;
const LABEL_PADDING_X = 8;
const LABEL_BADGE_SIZE = 16;
const LABEL_BADGE_GAP = 6;
const LABEL_CORNER_RADIUS = 10;
const LABEL_BG_COLOR = 0x64748b; // slate-500
const LABEL_BG_ALPHA = 0.6;
const LABEL_BORDER_COLOR = 0x475569; // slate-600

type ParsedLabel = {
  name: string;
  level: number;
};

export class NameLabel extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Graphics;
  private badgeBackground: Phaser.GameObjects.Graphics;
  private levelText: Phaser.GameObjects.Text;
  private nameText: Phaser.GameObjects.Text;
  private rawText = "Player (0)";
  private currentLevel = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
    super(scene, x, y);
    scene.add.existing(this);

    const fontFamily = resolveGeistFontFamily();
    this.background = scene.add.graphics();
    this.badgeBackground = scene.add.graphics();
    this.levelText = scene.add.text(0, 0, "0", {
      fontFamily,
      fontSize: "9px",
      color: "#e2e8f0",
      fontStyle: "700",
      resolution: 10,
    });
    this.nameText = scene.add.text(0, 0, "Player", {
      fontFamily,
      fontSize: "11px",
      color: "#f8fafc",
      fontStyle: "600",
      resolution: 2,
    });

    this.levelText.setOrigin(0.5, 0.5);
    this.nameText.setOrigin(0, 0.5);

    this.add([this.background, this.badgeBackground, this.levelText, this.nameText]);
    this.setSize(LABEL_MIN_WIDTH, LABEL_HEIGHT);
    this.setScrollFactor(1, 1);
    this.setText(text || "Player (0)");
  }

  get text() {
    return this.rawText;
  }

  setText(value: string) {
    const parsed = parseLabel(value);
    const theme = getLevelTheme(parsed.level);
    this.rawText = `${parsed.name} (${parsed.level})`;
    this.currentLevel = parsed.level;
    this.levelText.setText(String(parsed.level));
    this.levelText.setColor(theme.phaser.levelText);
    this.nameText.setText(parsed.name);
    this.layout();
    return this;
  }

  private layout() {
    const levelWidth = Math.max(this.levelText.width, LABEL_BADGE_SIZE - 4);
    const dynamicBadgeWidth = Math.max(LABEL_BADGE_SIZE, levelWidth + 6);
    const badgeCenterX = LABEL_PADDING_X + dynamicBadgeWidth / 2;
    const nameX = LABEL_PADDING_X + dynamicBadgeWidth + LABEL_BADGE_GAP;
    const contentWidth = nameX + this.nameText.width + LABEL_PADDING_X;
    const computedWidth = Math.max(LABEL_MIN_WIDTH, Math.ceil(contentWidth));
    const width = computedWidth % 2 === 0 ? computedWidth : computedWidth + 1;
    const height = LABEL_HEIGHT;
    const halfW = width / 2;
    const halfH = height / 2;

    this.background.clear();
    this.background.fillStyle(LABEL_BG_COLOR, LABEL_BG_ALPHA);
    this.background.lineStyle(1, LABEL_BORDER_COLOR, 0.9);
    this.background.fillRoundedRect(-halfW, -halfH, width, height, LABEL_CORNER_RADIUS);
    this.background.strokeRoundedRect(-halfW, -halfH, width, height, LABEL_CORNER_RADIUS);

    const badgeCenter = { x: Math.round(-halfW + badgeCenterX), y: 0 };
    this.drawHexBadge(badgeCenter.x, badgeCenter.y, dynamicBadgeWidth, LABEL_BADGE_SIZE);
    this.levelText.setPosition(badgeCenter.x, 0);
    this.nameText.setPosition(Math.round(-halfW + nameX), 0);

    this.setSize(width, height);
  }

  private drawHexBadge(centerX: number, centerY: number, width: number, height: number) {
    const halfW = width / 2;
    const halfH = height / 2;
    const inset = Math.min(halfH, Math.max(3, Math.round(width * 0.2)));

    const points = [
      new Phaser.Geom.Point(centerX - halfW + inset, centerY - halfH),
      new Phaser.Geom.Point(centerX + halfW - inset, centerY - halfH),
      new Phaser.Geom.Point(centerX + halfW, centerY),
      new Phaser.Geom.Point(centerX + halfW - inset, centerY + halfH),
      new Phaser.Geom.Point(centerX - halfW + inset, centerY + halfH),
      new Phaser.Geom.Point(centerX - halfW, centerY),
    ];

    this.badgeBackground.clear();
    this.badgeBackground.fillStyle(getLevelTheme(this.currentLevel).phaser.badgeFill, 1);
    this.badgeBackground.fillPoints(points, true);
  }
}

export function createNameLabel(scene: Phaser.Scene, name: string, x: number, y: number) {
  const label = new NameLabel(scene, x, y - LABEL_OFFSET_Y, name || "Player (0)");
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

function parseLabel(text?: string): ParsedLabel {
  const raw = (text ?? "Player (0)").trim();
  const match = raw.match(/^(.*)\((\d+)\)\s*$/);
  if (!match) {
    return { name: raw || "Player", level: 0 };
  }
  const name = match[1].trim() || "Player";
  const level = Math.max(0, Number.parseInt(match[2] ?? "0", 10) || 0);
  return { name, level };
}

export function positionLabel(label: Phaser.GameObjects.Container, x: number, y: number, smoothing = 0) {
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
