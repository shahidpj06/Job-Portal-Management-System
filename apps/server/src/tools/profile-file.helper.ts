import { fileTypeFromBuffer } from "file-type";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";

import {
  PROFILE_UPLOAD_RULES,
  type ProfileUploadKind,
} from "../config/upload.js";
import { ApiError } from "./api-error.js";
import { IValidatedUpload } from "../types/upload-file.js";

const invalidFileError = (message: string) => {
  return new ApiError({
    statusCode: 422,
    code: "INVALID_FILE",
    message,
  });
};

const getResumeFilename = (originalName: string): string => {
  const basename = originalName.split(/[\\/]/).pop() ?? "resume";

  const name = basename
    .replace(/\.[^.]*$/, "")
    .replace(/[^a-zA-Z0-9 _-]/g, "")
    .trim()
    .slice(0, 100);

  return `${name || "resume"}.pdf`;
};

const validateResume = async (
  file: Express.Multer.File,
): Promise<IValidatedUpload> => {
  try {
    const document = await PDFDocument.load(file.buffer, {
      ignoreEncryption: false,
      throwOnInvalidObject: true,
      updateMetadata: false,
    });

    if (document.isEncrypted || document.getPageCount() === 0) {
      throw invalidFileError(
        "Upload a readable PDF containing at least one page.",
      );
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw invalidFileError(
      "The resume is invalid or password-protected. Upload an unencrypted PDF.",
    );
  }

  return {
    buffer: file.buffer,
    contentType: "application/pdf",
    extension: "pdf",
    filename: getResumeFilename(file.originalname),
    size: file.buffer.length,
  };
};

const validateAvatar = async (
  file: Express.Multer.File,
): Promise<IValidatedUpload> => {
  try {
    const image = sharp(file.buffer, {
      failOn: "warning",
      limitInputPixels: 20_000_000,
    });

    const metadata = await image.metadata();

    if ((metadata.pages ?? 1) > 1) {
      throw invalidFileError(
        "Animated images are not supported. Upload a still image.",
      );
    }

    const buffer = await image
      .rotate()
      .resize({
        width: 512,
        height: 512,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();

    if (buffer.length > PROFILE_UPLOAD_RULES.avatar.maxBytes) {
      throw invalidFileError(
        "The processed image is too large. Choose a smaller image.",
      );
    }

    return {
      buffer,
      contentType: "image/webp",
      extension: "webp",
      filename: "profile.webp",
      size: buffer.length,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw invalidFileError(
      "The image could not be processed. Upload a valid JPEG, PNG, or WebP image under 20 megapixels.",
    );
  }
};

export const validateProfileFile = async (
  kind: ProfileUploadKind,
  file: Express.Multer.File,
): Promise<IValidatedUpload> => {
  const rules = PROFILE_UPLOAD_RULES[kind];

  if (file.buffer.length === 0) {
    throw invalidFileError("The uploaded file is empty.");
  }

  if (file.buffer.length > rules.maxBytes) {
    throw new ApiError({
      statusCode: 413,
      code: "UPLOAD_TOO_LARGE",
      message: `The ${kind} exceeds the allowed size.`,
    });
  }

  let detectedType: Awaited<ReturnType<typeof fileTypeFromBuffer>>;

  try {
    detectedType = await fileTypeFromBuffer(file.buffer);
  } catch {
    throw invalidFileError("The file type could not be identified.");
  }

  const allowedMimeTypes: readonly string[] = rules.allowedMimeTypes;

  if (!detectedType || !allowedMimeTypes.includes(detectedType.mime)) {
    throw invalidFileError(
      kind === "resume"
        ? "Upload a PDF resume."
        : "Upload a JPEG, PNG, or WebP profile image.",
    );
  }

  return kind === "resume" ? validateResume(file) : validateAvatar(file);
};
