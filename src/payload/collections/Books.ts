import type { CollectionConfig } from "payload";
import { draftContentAccess } from "../access";
import { GROUPS } from "../groups";
import { revalidateCollection } from "../hooks/revalidate";

/** «دار النشر». The first book of each category (by drag order) is the one featured. */
export const Books: CollectionConfig = {
  slug: "books",
  labels: { singular: "مؤلَّف", plural: "دار النشر" },
  orderable: true,
  admin: {
    group: GROUPS.content,
    useAsTitle: "title",
    defaultColumns: ["title", "category", "author", "_status"],
    description: "رتّب المؤلفات بالسحب: الأوّل في كل باب هو المؤلَّف المختار.",
  },
  access: draftContentAccess,
  versions: { drafts: true },
  hooks: revalidateCollection("books"),
  fields: [
    {
      name: "title",
      type: "text",
      label: "العنوان",
      required: true,
    },
    {
      name: "category",
      type: "select",
      label: "الباب",
      required: true,
      defaultValue: "works",
      options: [
        { label: "مؤلفات دار النشر", value: "works" },
        { label: "مؤلفات عن السيد", value: "about" },
      ],
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      label: "الغلاف",
    },
    {
      name: "summary",
      type: "textarea",
      label: "نبذة",
      admin: { rows: 5 },
    },
    {
      type: "row",
      fields: [
        { name: "author", type: "text", label: "المؤلِّف", admin: { width: "50%" } },
        { name: "publisher", type: "text", label: "الناشر", admin: { width: "50%" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "year", type: "text", label: "سنة النشر", admin: { width: "50%" } },
        { name: "pages", type: "number", label: "عدد الصفحات", min: 1, admin: { width: "50%" } },
      ],
    },
    {
      name: "file",
      type: "upload",
      relationTo: "documents",
      label: "نسخة رقمية",
      admin: { description: "اختيارية — ملف PDF للمؤلَّف." },
    },
  ],
};
