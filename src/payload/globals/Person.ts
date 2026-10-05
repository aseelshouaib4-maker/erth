import type { Field, GlobalConfig } from "payload";
import { anyone, staff } from "../access";
import { GROUPS } from "../groups";
import { revalidateGlobal } from "../hooks/revalidate";

const lifeEvent = (name: string, label: string): Field => ({
  name,
  type: "group",
  label,
  fields: [
    {
      type: "row",
      fields: [
        { name: "date", type: "text", label: "التاريخ كما يُكتب", required: true, admin: { width: "40%" } },
        { name: "year", type: "number", label: "السنة", required: true, min: 1900, max: 2100, admin: { width: "20%" } },
        { name: "place", type: "text", label: "المكان", required: true, admin: { width: "40%" } },
      ],
    },
  ],
});

/** The person the site is about. Used across the header, hero, intro and footer. */
export const Person: GlobalConfig = {
  slug: "person",
  label: "الشخصية",
  admin: { group: GROUPS.settings },
  access: { read: anyone, update: staff },
  hooks: revalidateGlobal("person"),
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", label: "الاسم", required: true, admin: { width: "40%" } },
        { name: "storyTitle", type: "text", label: "عنوان القصة", required: true, admin: { width: "60%" } },
      ],
    },
    lifeEvent("birth", "الولادة"),
    lifeEvent("death", "الوفاة"),
    {
      type: "row",
      fields: [
        { name: "father", type: "text", label: "الأب", admin: { width: "25%" } },
        { name: "family", type: "text", label: "العائلة", admin: { width: "25%" } },
        { name: "spouse", type: "text", label: "الزوجة", admin: { width: "25%" } },
        { name: "children", type: "text", label: "الأبناء", admin: { width: "25%" } },
      ],
    },
    {
      name: "portrait",
      type: "upload",
      relationTo: "media",
      label: "الصورة الشخصية",
      admin: { description: "تظهر في المقدّمة. إن تُركت فارغة بقيت الصورة الحالية." },
    },
    {
      name: "quote",
      type: "textarea",
      label: "اقتباس رئيسي",
    },
  ],
};
