import type { GlobalConfig } from "payload";
import { anyone, staff } from "../access";
import { GROUPS } from "../groups";
import { revalidateGlobal } from "../hooks/revalidate";

/** «من نحن» on the homepage. */
export const About: GlobalConfig = {
  slug: "about",
  label: "من نحن",
  admin: { group: GROUPS.home },
  access: { read: anyone, update: staff },
  hooks: revalidateGlobal("about"),
  fields: [
    {
      type: "row",
      fields: [
        { name: "title", type: "text", label: "العنوان الصغير", required: true, admin: { width: "50%" } },
        { name: "name", type: "text", label: "العنوان", required: true, admin: { width: "50%" } },
      ],
    },
    {
      name: "paragraphs",
      type: "array",
      label: "الفقرات",
      labels: { singular: "فقرة", plural: "الفقرات" },
      minRows: 1,
      fields: [{ name: "text", type: "textarea", label: "النص", required: true, admin: { rows: 4 } }],
    },
  ],
};
