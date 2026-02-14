import { resolve } from 'path';

export function getUploadDirectory(): string {
  return resolve(__dirname, '..', '..', '..', '..', 'uploads');
}
