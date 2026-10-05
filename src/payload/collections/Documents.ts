import type { CollectionConfig } from "payload";
import { anyone, staff } from "../access";
import { GROUPS } from "../groups";
import { revalidateCollection } from "../hooks/revalidate";
import { DOCUMENT_MAX_BYTES, limitFileSize, uploadDir } from "../uploads";

export const DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/rtf",
  "text/plain",
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/webm",
];

/** Downloadable files: texts and documents in the archive, book PDFs, audio recordings. */
export const Documents: CollectionConfig = {
  slug: "documents",
  labels: { singular: "ملف", plural: "الوثائق والملفات" },
  admin: {
    group: GROUPS.library,
    useAsTitle: "title",
    defaultColumns: ["title", "filename", "mimeType", "updatedAt"],
  },
  access: { read: anyone, create: staff, update: staff, delete: staff },
  hooks: {
    ...revalidateCollection("documents", { everything: true }),
    beforeOperation: [limitFileSize(DOCUMENT_MAX_BYTES)],
  },
  upload: {
    staticDir: uploadDir("documents"),
    mimeTypes: DOCUMENT_MIME_TYPES,
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "العنوان",
      required: true,
    },
  ],
};
