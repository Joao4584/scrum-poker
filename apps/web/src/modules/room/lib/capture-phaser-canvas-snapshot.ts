function getPhaserCanvas(): HTMLCanvasElement | null {
  const container = document.getElementById("phaser-game-container");
  if (!container) return null;
  return container.querySelector("canvas");
}

export async function capturePhaserCanvasSnapshot(): Promise<Blob> {
  const canvas = getPhaserCanvas();
  if (!canvas) {
    throw new Error("Phaser canvas not found");
  }

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });

  if (!blob) {
    throw new Error("Failed to capture Phaser canvas snapshot");
  }

  return blob;
}
