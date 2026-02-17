export interface CaptureCanvasSnapshotInput {
  selector: string;
  maxWidth?: number;
  mimeType?: string;
}

function getCanvasBySelector(selector: string): HTMLCanvasElement | null {
  const element = document.querySelector(selector);
  if (!element) return null;
  return element instanceof HTMLCanvasElement ? element : null;
}

function resizeCanvasIfNeeded(sourceCanvas: HTMLCanvasElement, maxWidth?: number): HTMLCanvasElement {
  const sourceWidth = sourceCanvas.width;
  const sourceHeight = sourceCanvas.height;

  if (!maxWidth || sourceWidth <= maxWidth) {
    return sourceCanvas;
  }

  const scale = maxWidth / sourceWidth;
  const targetWidth = maxWidth;
  const targetHeight = Math.max(1, Math.round(sourceHeight * scale));

  const resizedCanvas = document.createElement("canvas");
  resizedCanvas.width = targetWidth;
  resizedCanvas.height = targetHeight;

  const context = resizedCanvas.getContext("2d");
  if (!context) {
    throw new Error("Failed to create snapshot canvas context");
  }

  context.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);
  return resizedCanvas;
}

export async function captureCanvasSnapshot(input: CaptureCanvasSnapshotInput): Promise<Blob> {
  const canvas = getCanvasBySelector(input.selector);
  if (!canvas) {
    throw new Error(`Canvas not found for selector: ${input.selector}`);
  }

  const snapshotCanvas = resizeCanvasIfNeeded(canvas, input.maxWidth);
  const mimeType = input.mimeType ?? "image/png";

  const blob = await new Promise<Blob | null>((resolve) => {
    snapshotCanvas.toBlob(resolve, mimeType);
  });

  if (!blob) {
    throw new Error("Failed to capture canvas snapshot");
  }

  return blob;
}
