import { basename, extname } from 'path';

const mimeToExtensionMap: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/bmp': '.bmp',
  'image/x-icon': '.ico',
  'image/avif': '.avif',
};

export function getExtensionFromMimeType(mimeType: string): string {
  return mimeToExtensionMap[mimeType] ?? '';
}

function generateNineDigits(): string {
  return `${Math.floor(Math.random() * 1_000_000_000)}`.padStart(9, '0');
}

function normalizeBaseName(originalName: string): string {
  const nameWithoutExtension = basename(originalName || '', extname(originalName || ''));
  const normalized = nameWithoutExtension
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  return (normalized || 'arquivo').slice(0, 20);
}

export function buildUploadFileName(originalName: string, extension: string): string {
  const prefix = generateNineDigits();
  const normalized = normalizeBaseName(originalName);
  return `${prefix}_${normalized}${extension.toLowerCase()}`;
}
