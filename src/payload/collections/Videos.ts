import type { CollectionConfig } from "payload";
import { anyone, staff } from "../access";
import { GROUPS } from "../groups";
import { revalidateCollection } from "../hooks/revalidate";
import { limitFileSize, MAX_UPLOAD_BYTES, uploadDir } from "../uploads";

/**
 * Uploaded video files. MP4 (H.264) plays in every browser; WebM is accepted too.
 * In production nginx serves this directory directly so seeking stays fast.
 */
export const Videos: CollectionConfig = {
  slug: "videos",
  labels: { singular: "فيديو", plural: "ملفات الفيديو" },
  admin: {
    group: GROUPS.library,
    useAsTitle: "title",
    defaultColumns: ["title", "filename", "filesize", "updatedAt"],
    description: "ملفات الفيديو المرفوعة إلى الخادم. لفيديوهات YouTube وغيرها يكفي الرابط داخل المادّة نفسها.",
  },
  access: { read: anyone, create: staff, update: staff, delete: staff },
  hooks: {
    ...revalidateCollection("videos", { everything: true }),
    beforeOperation: [limitFileSize(MAX_UPLOAD_BYTES)],
  },
  upload: {
    staticDir: uploadDir("videos"),
    mimeTypes: ["video/mp4", "video/webm"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "العنوان",
      required: true,
    },
    {
      name: "poster",
      type: "upload",
      relationTo: "media",
      label: "صورة الغلاف",
      admin: { description: "تظهر قبل التشغيل حيثما استُعمل هذا الملف." },
    },
  ],
};
