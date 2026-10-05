import type { CollectionConfig } from "payload";
import { contentAccess } from "../access";
import { GROUPS } from "../groups";
import { revalidateCollection } from "../hooks/revalidate";

/** محطّات مفصلية داخل المراحل. They feed the archive search and the site search. */
export const Moments: CollectionConfig = {
  slug: "moments",
  labels: { singular: "محطّة", plural: "المحطّات" },
  defaultSort: "year",
  admin: {
    group: GROUPS.content,
    useAsTitle: "label",
    defaultColumns: ["label", "year", "stage"],
  },
  access: contentAccess,
  hooks: revalidateCollection("moments"),
  fields: [
    {
      name: "label",
      type: "text",
      label: "المحطّة",
      required: true,
    },
    {
      type: "row",
      fields: [
        { name: "year", type: "number", label: "السنة", required: true, min: 1900, max: 2100, admin: { width: "30%" } },
        {
          name: "date",
          type: "text",
          label: "التاريخ كما يُكتب",
          admin: { width: "70%", description: "اختياري، مثل: 16 شباط 1992" },
        },
      ],
    },
    {
      name: "stage",
      type: "relationship",
      relationTo: "stages",
      label: "المرحلة",
      required: true,
    },
  ],
};
