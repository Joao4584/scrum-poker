import * as Phaser from "phaser";
import { sanitizeChatMessage } from "../../chat-config";

export type ChatBubble = {
  container: Phaser.GameObjects.Container;
  background: Phaser.GameObjects.Graphics;
  text: Phaser.GameObjects.Text;
};

const MAX_WIDTH = 200;
const PADDING_X = 4;
const PADDING_Y = 3;
const OFFSET_Y = 54;

export function createChatBubble(scene: Phaser.Scene, message: string, x: number, y: number) {
  const safeMessage = sanitizeChatMessage(message);
  const background = scene.add.graphics();
  const text = scene.add.text(0, 0, safeMessage, {
    fontFamily: "PixelFont, monospace",
    fontSize: "16px",
    color: "#0b1220",
    strokeThickness: 0,
    align: "left",
    resolution: 100,
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

export function positionChatBubble(bubble: ChatBubble, x: number, y: number, smoothing = 1) {
  const width = bubble.text.width + PADDING_X * 2;
  const height = bubble.text.height + PADDING_Y * 2;
  const targetPx = x - width / 2;
  const targetPy = y - OFFSET_Y - height;
  const useSmooth = smoothing > 0 && smoothing < 1;
  const px = useSmooth
    ? Phaser.Math.Linear(bubble.container.x, targetPx, smoothing)
    : Math.round(targetPx);
  const py = useSmooth
    ? Phaser.Math.Linear(bubble.container.y, targetPy, smoothing)
    : Math.round(targetPy);

  if (bubble.container.x !== px || bubble.container.y !== py) {
    bubble.container.setPosition(px, py);
  }

  const depth = Math.round(targetPy + 10);
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
  // Outer stroke for a pixelated border
  background.fillStyle(0x0b1220, 1);
  background.fillRect(-1, -1, width + 2, height + 2);
  // Main body
  background.fillStyle(0xf8fafc, 1);
  background.fillRect(0, 0, width, height);
  // Tail (small pixel triangle)
  const tailX = Math.round(width / 2) - 3;
  const tailY = height;
  background.fillStyle(0x0b1220, 1);
  background.fillRect(tailX - 1, tailY, 6, 3);
  background.fillStyle(0xf8fafc, 1);
  background.fillRect(tailX, tailY, 4, 2);
}
