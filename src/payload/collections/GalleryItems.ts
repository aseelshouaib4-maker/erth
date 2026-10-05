import type { CollectionConfig } from "payload";
import { draftContentAccess } from "../access";
import { stageField, yearField } from "../fields/common";
import { GROUPS } from "../groups";
import { revalidateCollection } from "../hooks/revalidate";

/** المعرض. The grid layout follows the drag order; each picture keeps its own proportions. */
export const GalleryItems: CollectionConfig = {
  slug: "gallery",
  labels: { singular: "صورة المعرض", plural: "المعرض" },
  orderable: true,
  admin: {
    group: GROUPS.content,
    useAsTitle: "caption",
    defaultColumns: ["image", "caption", "year", "_status"],
  },
  access: draftContentAccess,
  versions: { drafts: true },
  hooks: revalidateCollection("gallery"),
  fields: [
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "الصورة",
      required: true,
    },
    {
      name: "caption",
      type: "text",
      label: "التعليق",
    },
    stageField,
    yearField,
  ],
};
