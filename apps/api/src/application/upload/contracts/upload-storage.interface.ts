export interface StoreUploadFileInput {
  file_name: string;
  mime_type: string;
  buffer: Buffer;
}

export interface StoreUploadFileOutput {
  url: string;
}

export interface UploadStorage {
  saveFile(input: StoreUploadFileInput): Promise<StoreUploadFileOutput>;
  deleteFile(url: string): Promise<void>;
  getFile(url: string): Promise<Buffer>;
}
