import * as Phaser from "phaser";
import { sanitizeChatMessage } from "../../chat-config";

export type ChatBubble = {
  container: Phaser.GameObjects.Container;
  background: Phaser.GameObjects.Graphics;
  text: Phaser.GameObjects.Text;
};

const MAX_WIDTH = 200;
const PADDING_X = 8;
const PADDING_Y = 6;
const BUBBLE_RADIUS = 3;
const SHADOW_OFFSET = 2;
const SHADOW_ALPHA = 0.2;
const SHADOW_COLOR = 0x0b1220;
const OFFSET_Y = 51;
const CHAT_BUBBLE_BASE_DEPTH = 20000;

export function createChatBubble(scene: Phaser.Scene, message: string, x: number, y: number) {
  const safeMessage = sanitizeChatMessage(message);
  const fontFamily = resolveGeistFontFamily();
  const background = scene.add.graphics();
  const text = scene.add.text(0, 0, safeMessage, {
    fontFamily,
    fontSize: "13px",
    color: "#0f172a",
    strokeThickness: 0,
    align: "left",
    resolution: 2,
    wordWrap: { width: MAX_WIDTH - PADDING_X * 2 },
  });
  text.setOrigin(0, 0);
  text.setScrollFactor(1, 1);
  background.setScrollFactor(1, 1);

  const container = scene.add.container(x, y, [background, text]);
  container.setScrollFactor(1, 1);
  layoutBubble(background, text, safeMessage);
  container.setVisible(!!safeMessage);
  return { container, background, text };
}

export function updateChatBubble(bubble: ChatBubble, message: string) {
  const safeMessage = sanitizeChatMessage(message);
  bubble.text.setText(safeMessage);
  layoutBubble(bubble.background, bubble.text, safeMessage);
  bubble.container.setVisible(!!safeMessage);
}

export function positionChatBubble(bubble: ChatBubble, x: number, y: number, smoothing = 0.15) {
  const width = bubble.text.width + PADDING_X * 2;
  const height = bubble.text.height + PADDING_Y * 2;
  const targetPx = x - width / 2;
  const targetPy = y - OFFSET_Y - height;

  const smooth = Phaser.Math.Clamp(smoothing, 0, 1);
  const px =
    smooth > 0 && smooth < 1 ? Phaser.Math.Linear(bubble.container.x, targetPx, smooth) : targetPx;
  const py =
    smooth > 0 && smooth < 1 ? Phaser.Math.Linear(bubble.container.y, targetPy, smooth) : targetPy;

  const snapPx = Math.abs(px - targetPx) < 0.25 ? targetPx : px;
  const snapPy = Math.abs(py - targetPy) < 0.25 ? targetPy : py;

  const finalPx = Math.round(snapPx);
  const finalPy = Math.round(snapPy);

  if (bubble.container.x !== finalPx || bubble.container.y !== finalPy) {
    bubble.container.setPosition(finalPx, finalPy);
  }

  const depth = CHAT_BUBBLE_BASE_DEPTH + Math.round(y);
  if (bubble.container.depth !== depth) {
    bubble.container.setDepth(depth);
  }
}

export function destroyChatBubble(bubble: ChatBubble) {
  bubble.container.destroy();
}

function resolveGeistFontFamily() {
  if (typeof document === "undefined") {
    return "system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif";
  }
  const geist = getComputedStyle(document.body).getPropertyValue("--font-geist-sans").trim();
  if (geist) {
    return `${geist}, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  }
  return "system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif";
}

function layoutBubble(
  background: Phaser.GameObjects.Graphics,
  text: Phaser.GameObjects.Text,
  message: string,
) {
  const visible = !!message;
  if (!visible) {
    background.clear();
    return;
  }

  text.setWordWrapWidth(MAX_WIDTH - PADDING_X * 2, false);
  text.updateText();
  text.setPosition(PADDING_X, PADDING_Y);

  const width = Math.round(Math.min(text.width + PADDING_X * 2, MAX_WIDTH));
  const height = Math.round(text.height + PADDING_Y * 2);

  background.clear();
  background.fillStyle(SHADOW_COLOR, SHADOW_ALPHA);
  background.fillRoundedRect(
    SHADOW_OFFSET,
    SHADOW_OFFSET,
    width,
    height,
    BUBBLE_RADIUS,
  );
  background.fillStyle(0xf8fafc, 1);
  background.fillRoundedRect(0, 0, width, height, BUBBLE_RADIUS);
  const tailX = Math.round(width / 2) - 4;
  const tailY = height - 1;
  background.fillStyle(SHADOW_COLOR, SHADOW_ALPHA);
  background.fillTriangle(
    tailX + SHADOW_OFFSET,
    tailY + SHADOW_OFFSET,
    tailX + 8 + SHADOW_OFFSET,
    tailY + SHADOW_OFFSET,
    tailX + 4 + SHADOW_OFFSET,
    tailY + 6 + SHADOW_OFFSET,
  );
  background.fillStyle(0xf8fafc, 1);
  background.fillTriangle(tailX, tailY, tailX + 8, tailY, tailX + 4, tailY + 6);
}
