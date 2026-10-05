import type { CollectionConfig } from "payload";
import { draftContentAccess } from "../access";
import { stageField, yearField } from "../fields/common";
import { videoField } from "../fields/video";
import { GROUPS } from "../groups";
import { revalidateCollection } from "../hooks/revalidate";

/** خطابات. Listed on «/speeches» and as the fourth type inside the archive. */
export const Speeches: CollectionConfig = {
  slug: "speeches",
  labels: { singular: "خطاب", plural: "الخطابات" },
  orderable: true,
  admin: {
    group: GROUPS.content,
    useAsTitle: "title",
    defaultColumns: ["title", "year", "stage", "_status"],
    description: "رتّب الخطابات بالسحب: الترتيب هنا هو ترتيب لائحة الخطابات.",
  },
  access: draftContentAccess,
  versions: { drafts: true },
  hooks: revalidateCollection("speeches"),
  fields: [
    {
      name: "title",
      type: "text",
      label: "العنوان",
      required: true,
    },
    videoField(),
    {
      name: "excerpt",
      type: "textarea",
      label: "مقتطف",
      admin: { rows: 5 },
    },
    {
      name: "duration",
      type: "text",
      label: "المدة",
      admin: { position: "sidebar", description: "مثل: 45:12" },
    },
    stageField,
    yearField,
  ],
};
