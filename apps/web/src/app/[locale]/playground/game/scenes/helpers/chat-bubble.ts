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
const OFFSET_Y = 54;

export function createChatBubble(scene: Phaser.Scene, message: string, x: number, y: number) {
  const safeMessage = sanitizeChatMessage(message);
  const background = scene.add.graphics();
  const text = scene.add.text(0, 0, safeMessage, {
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
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
    smooth > 0 && smooth < 1
      ? Phaser.Math.Linear(bubble.container.x, targetPx, smooth)
      : targetPx;
  const py =
    smooth > 0 && smooth < 1
      ? Phaser.Math.Linear(bubble.container.y, targetPy, smooth)
      : targetPy;

  const snapPx = Math.abs(px - targetPx) < 0.25 ? targetPx : px;
  const snapPy = Math.abs(py - targetPy) < 0.25 ? targetPy : py;

  const finalPx = Math.round(snapPx);
  const finalPy = Math.round(snapPy);

  if (bubble.container.x !== finalPx || bubble.container.y !== finalPy) {
    bubble.container.setPosition(finalPx, finalPy);
  }

  const depth = Math.round(y + 5);
  if (bubble.container.depth !== depth) {
    bubble.container.setDepth(depth);
  }
}

export function destroyChatBubble(bubble: ChatBubble) {
  bubble.container.destroy();
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
  background.fillStyle(0x0b1220, 1);
  background.fillRoundedRect(-1, -1, width + 2, height + 2, 6);
  background.fillStyle(0xf8fafc, 1);
  background.fillRoundedRect(0, 0, width, height, 6);
  const tailX = Math.round(width / 2) - 4;
  const tailY = height - 1;
  background.fillStyle(0x0b1220, 1);
  background.fillTriangle(tailX - 2, tailY, tailX + 10, tailY, tailX + 4, tailY + 8);
  background.fillStyle(0xf8fafc, 1);
  background.fillTriangle(tailX, tailY, tailX + 8, tailY, tailX + 4, tailY + 6);
}
