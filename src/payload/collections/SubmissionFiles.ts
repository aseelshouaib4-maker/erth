import type { CollectionConfig } from "payload";
import { admins, staff } from "../access";
import { GROUPS } from "../groups";
import { uploadDir } from "../uploads";
import { DOCUMENT_MIME_TYPES } from "./Documents";

/**
 * Files visitors send with «شارك بالتوثيق». Private: only staff can open them,
 * and they are only ever created by the submission action on the server.
 * nginx must never serve this directory directly.
 */
export const SubmissionFiles: CollectionConfig = {
  slug: "submission-files",
  labels: { singular: "مرفق", plural: "مرفقات الوارد" },
  admin: {
    group: GROUPS.inbox,
    useAsTitle: "filename",
    defaultColumns: ["filename", "mimeType", "filesize", "createdAt"],
  },
  access: { read: staff, create: () => false, update: staff, delete: admins },
  upload: {
    staticDir: uploadDir("private/submissions"),
    mimeTypes: [...DOCUMENT_MIME_TYPES, "image/jpeg", "image/png", "image/webp", "image/gif"],
  },
  fields: [],
};
