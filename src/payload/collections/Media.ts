import type { CollectionConfig } from "payload";
import { anyone, staff } from "../access";
import { GROUPS } from "../groups";
import { revalidateCollection } from "../hooks/revalidate";
import { IMAGE_MAX_BYTES, limitFileSize, uploadDir } from "../uploads";

/** Images. The site resizes them on request, so only the admin thumbnail is generated here. */
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "صورة", plural: "الصور" },
  admin: {
    group: GROUPS.library,
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "updatedAt"],
  },
  access: { read: anyone, create: staff, update: staff, delete: staff },
  hooks: {
    ...revalidateCollection("media", { everything: true }),
    beforeOperation: [limitFileSize(IMAGE_MAX_BYTES)],
  },
  upload: {
    staticDir: uploadDir("media"),
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
    focalPoint: true,
    adminThumbnail: "thumbnail",
    imageSizes: [{ name: "thumbnail", width: 480 }],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "وصف الصورة",
      required: true,
      admin: { description: "جملة قصيرة تصف ما في الصورة. يقرؤها قارئ الشاشة وتظهر إن لم تُحمَّل الصورة." },
    },
    {
      name: "caption",
      type: "text",
      label: "تعليق",
    },
  ],
};
