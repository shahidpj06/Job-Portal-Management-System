const MEGABYTE = 1024 * 1024;

export const PROFILE_UPLOAD_RULES = {
  avatar: {
    maxBytes: 2 * MEGABYTE,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  resume: {
    maxBytes: 5 * MEGABYTE,
    allowedMimeTypes: ["application/pdf"],
  },
} as const;

export type ProfileUploadKind = keyof typeof PROFILE_UPLOAD_RULES;

export const PRIVATE_FILE_URL_TTL_SECONDS = 5 * 60;
