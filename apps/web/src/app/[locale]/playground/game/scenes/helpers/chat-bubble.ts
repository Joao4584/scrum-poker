import * as Phaser from "phaser";

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
  const background = scene.add.graphics();
  const text = scene.add.text(0, 0, message, {
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
  layoutBubble(background, text, message);
  container.setVisible(!!message);
  return { container, background, text };
}

export function updateChatBubble(bubble: ChatBubble, message: string) {
  bubble.text.setText(message);
  layoutBubble(bubble.background, bubble.text, message);
  bubble.container.setVisible(!!message);
}

export function positionChatBubble(bubble: ChatBubble, x: number, y: number) {
  const width = bubble.text.width + PADDING_X * 2;
  const height = bubble.text.height + PADDING_Y * 2;
  const px = Math.round(x - width / 2);
  const py = Math.round(y - OFFSET_Y - height);
  bubble.container.setPosition(px, py);
  bubble.container.setDepth(py + 10);
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
