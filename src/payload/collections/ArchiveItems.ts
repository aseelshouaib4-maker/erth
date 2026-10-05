import type { CollectionConfig } from "payload";
import { draftContentAccess } from "../access";
import { archiveSizeField, stageField, yearField } from "../fields/common";
import { videoField } from "../fields/video";
import { GROUPS } from "../groups";
import { revalidateCollection } from "../hooks/revalidate";

/** Photographs, videos and texts. Speeches are their own collection and join the archive on the site. */
export const ArchiveItems: CollectionConfig = {
  slug: "archive-items",
  labels: { singular: "مادّة أرشيفية", plural: "الأرشيف" },
  defaultSort: "year",
  admin: {
    group: GROUPS.content,
    useAsTitle: "title",
    defaultColumns: ["title", "type", "year", "stage", "_status"],
    listSearchableFields: ["title"],
  },
  access: draftContentAccess,
  versions: { drafts: true },
  hooks: revalidateCollection("archive-items"),
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
          name: "type",
          type: "select",
          label: "النوع",
          required: true,
          defaultValue: "photo",
          options: [
            { label: "صورة", value: "photo" },
            { label: "فيديو", value: "video" },
            { label: "نصّ / وثيقة", value: "text" },
          ],
          admin: { width: "50%" },
        },
        {
          name: "kind",
          type: "select",
          label: "نوع الفيديو",
          options: [
            { label: "مقابلة", value: "interview" },
            { label: "محاضرة", value: "lecture" },
          ],
          admin: { width: "50%", condition: (data) => data?.type === "video" },
        },
      ],
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "الصورة",
      admin: {
        condition: (data) => data?.type !== "video",
        description: "للصور: الصورة نفسها. للنصوص: صورة الغلاف أو الصفحة الأولى (اختيارية).",
      },
    },
    videoField({ condition: (data) => data?.type === "video" }),
    {
      name: "duration",
      type: "text",
      label: "المدة",
      admin: { condition: (data) => data?.type === "video", description: "مثل: 12:40" },
    },
    {
      name: "document",
      type: "upload",
      relationTo: "documents",
      label: "الملف",
      admin: {
        condition: (data) => data?.type === "text",
        description: "الملف الذي يُحمَّل من الأرشيف (PDF أو Word أو نصّ).",
      },
    },
    stageField,
    yearField,
    archiveSizeField,
  ],
};
