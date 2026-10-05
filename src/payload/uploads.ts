import path from "path";
import { APIError, type CollectionBeforeOperationHook } from "payload";

/**
 * Uploaded files live outside the code: `UPLOADS_DIR` points at a directory
 * that survives deploys. Each collection gets its own sub-directory.
 */
const UPLOADS_ROOT = path.resolve(process.cwd(), process.env.UPLOADS_DIR || "uploads");

export const uploadDir = (name: string) => path.join(UPLOADS_ROOT, name);

const MB = 1024 * 1024;

/** Largest single upload anywhere in the admin; videos are what need it. */
export const MAX_UPLOAD_BYTES = (Number(process.env.MAX_UPLOAD_MB) || 2048) * MB;

export const IMAGE_MAX_BYTES = 30 * MB;
export const DOCUMENT_MAX_BYTES = 300 * MB;

const formatMb = (bytes: number) => `${Math.round(bytes / MB)} MB`;

/** Rejects a file above `maxBytes` before Payload writes it to disk. */
export function limitFileSize(maxBytes: number): CollectionBeforeOperationHook {
  return ({ args, operation, req }) => {
    if ((operation === "create" || operation === "update") && req.file && req.file.size > maxBytes) {
      throw new APIError(`حجم الملف يتجاوز الحدّ المسموح (${formatMb(maxBytes)}).`, 413, null, true);
    }
    return args;
  };
}
