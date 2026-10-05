import type { CollectionConfig } from "payload";
import { draftContentAccess } from "../access";
import { slugField } from "../fields/common";
import { videoField } from "../fields/video";
import { GROUPS } from "../groups";
import { revalidateCollection } from "../hooks/revalidate";

/**
 * مراحل السيرة. Their order (drag in the list) is the order of the biography,
 * the story and the intro; the chapter number is derived from it.
 */
export const Stages: CollectionConfig = {
  slug: "stages",
  labels: { singular: "مرحلة", plural: "مراحل السيرة" },
  orderable: true,
  admin: {
    group: GROUPS.content,
    useAsTitle: "title",
    defaultColumns: ["title", "period", "slug", "_status"],
    description: "رتّب المراحل بالسحب: الترتيب هنا هو ترتيبها في السيرة والقصة والمقدّمة.",
  },
  access: draftContentAccess,
  versions: { drafts: true },
  hooks: revalidateCollection("stages"),
  fields: [
    {
      name: "title",
      type: "text",
      label: "العنوان",
      required: true,
    },
    {
      type: "row",
      fields: [
        {
          name: "period",
          type: "text",
          label: "الفترة كما تُكتب",
          admin: { description: "مثل: 1959 - 1976", width: "40%" },
        },
        { name: "yearFrom", type: "number", label: "من سنة", min: 1900, max: 2100, admin: { width: "30%" } },
        { name: "yearTo", type: "number", label: "إلى سنة", min: 1900, max: 2100, admin: { width: "30%" } },
      ],
    },
    {
      name: "body",
      type: "textarea",
      label: "النص المختصر",
      required: true,
      admin: { rows: 6 },
    },
    {
      name: "longBody",
      type: "textarea",
      label: "النص الكامل",
      admin: { rows: 12 },
    },
    {
      name: "caption",
      type: "text",
      label: "تعليق الصورة",
    },
    {
      name: "media",
      type: "array",
      label: "الوسائط",
      labels: { singular: "مادّة", plural: "الوسائط" },
      admin: {
        description: "الصورة الأولى تظهر بجانب النص في السيرة والقصة. الوسائط الأخرى تظهر في القصة والمقدّمة.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "kind",
          type: "select",
          label: "النوع",
          required: true,
          defaultValue: "image",
          options: [
            { label: "صورة", value: "image" },
            { label: "فيديو", value: "video" },
            { label: "وثيقة", value: "document" },
          ],
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "الصورة",
          admin: { condition: (_, sibling) => sibling?.kind === "image" },
        },
        videoField({ condition: (_, sibling) => sibling?.kind === "video" }),
        {
          name: "document",
          type: "upload",
          relationTo: "documents",
          label: "الوثيقة",
          admin: { condition: (_, sibling) => sibling?.kind === "document" },
        },
        {
          name: "label",
          type: "text",
          label: "تسمية",
          admin: { description: "تظهر تحت المادّة. إن تُركت فارغة استُعمل وصف الصورة." },
        },
      ],
    },
    slugField,
  ],
};
