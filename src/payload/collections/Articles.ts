import type { CollectionConfig } from "payload";
import { draftContentAccess } from "../access";
import { GROUPS } from "../groups";
import { revalidateCollection } from "../hooks/revalidate";

/** «عين» — articles. Each one has its own page at /eye/<id>. */
export const Articles: CollectionConfig = {
  slug: "articles",
  labels: { singular: "مقال", plural: "مقالات عين" },
  defaultSort: "-publishedAt",
  admin: {
    group: GROUPS.content,
    useAsTitle: "title",
    defaultColumns: ["title", "author", "publishedAt", "_status"],
  },
  access: draftContentAccess,
  versions: { drafts: true },
  hooks: revalidateCollection("articles"),
  fields: [
    {
      name: "title",
      type: "text",
      label: "العنوان",
      required: true,
    },
    {
      name: "excerpt",
      type: "textarea",
      label: "وصف مختصر",
      admin: { rows: 3, description: "يظهر في فهرس عين وأعلى المقال." },
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      label: "صورة المقال",
    },
    {
      name: "body",
      type: "richText",
      label: "المتن",
    },
    {
      name: "publishedAt",
      type: "date",
      label: "تاريخ النشر",
      defaultValue: () => new Date().toISOString(),
      admin: { position: "sidebar", date: { pickerAppearance: "dayOnly", displayFormat: "d MMMM yyyy" } },
    },
    { name: "author", type: "text", label: "الكاتب", admin: { position: "sidebar" } },
    { name: "source", type: "text", label: "المصدر", admin: { position: "sidebar" } },
    {
      name: "readingTime",
      type: "text",
      label: "مدة القراءة",
      admin: { position: "sidebar", description: "تُحسب تلقائيًا من طول المتن إن تُركت فارغة." },
    },
  ],
};
