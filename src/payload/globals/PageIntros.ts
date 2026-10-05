import type { GlobalConfig } from "payload";
import { anyone, staff } from "../access";
import { GROUPS } from "../groups";
import { revalidateGlobal } from "../hooks/revalidate";

/** The short introductions at the top of section pages. */
export const PageIntros: GlobalConfig = {
  slug: "page-intros",
  label: "نصوص الصفحات",
  admin: { group: GROUPS.settings },
  access: { read: anyone, update: staff },
  hooks: revalidateGlobal("page-intros"),
  fields: [
    { name: "eye", type: "textarea", label: "عين — النص التعريفي", admin: { rows: 3 } },
    { name: "library", type: "textarea", label: "دار النشر — النص التعريفي", admin: { rows: 3 } },
  ],
};
