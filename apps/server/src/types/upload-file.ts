export interface IValidatedUpload {
  buffer: Buffer;
  contentType: "application/pdf" | "image/webp";
  extension: "pdf" | "webp";
  filename: string;
  size: number;
}
