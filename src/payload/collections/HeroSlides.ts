import type { CollectionConfig } from "payload";
import { draftContentAccess } from "../access";
import { GROUPS } from "../groups";
import { revalidateCollection } from "../hooks/revalidate";

/** Homepage hero: one archival image bound to one quote. */
export const HeroSlides: CollectionConfig = {
  slug: "hero-slides",
  labels: { singular: "شريحة", plural: "شرائح الواجهة" },
  orderable: true,
  admin: {
    group: GROUPS.home,
    useAsTitle: "source",
    defaultColumns: ["quote", "source", "date", "_status"],
    description: "الصورة تُقصّ لتملأ الشاشة؛ حدّد نقطة التركيز عند رفعها حتى يبقى المهمّ ظاهرًا.",
  },
  access: draftContentAccess,
  versions: { drafts: true },
  hooks: revalidateCollection("hero-slides"),
  fields: [
    {
      name: "quote",
      type: "textarea",
      label: "الاقتباس",
      required: true,
      admin: { rows: 4 },
    },
    {
      type: "row",
      fields: [
        { name: "source", type: "text", label: "المصدر", admin: { width: "60%" } },
        { name: "date", type: "text", label: "التاريخ", admin: { width: "40%" } },
      ],
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "الصورة",
    },
  ],
};
