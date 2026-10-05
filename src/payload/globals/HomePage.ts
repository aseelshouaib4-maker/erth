import type { GlobalConfig } from "payload";
import { anyone, staff } from "../access";
import { GROUPS } from "../groups";
import { revalidateGlobal } from "../hooks/revalidate";

/** What the homepage features. Anything left empty falls back to the first items of each list. */
export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "مختارات الرئيسية",
  admin: { group: GROUPS.home },
  access: { read: anyone, update: staff },
  hooks: revalidateGlobal("home-page"),
  fields: [
    {
      name: "speeches",
      type: "relationship",
      relationTo: "speeches",
      hasMany: true,
      maxRows: 5,
      label: "خطابات مختارة",
      admin: { description: "حتى خمسة خطابات. إن تُركت فارغة ظهرت الخمسة الأولى من لائحة الخطابات." },
    },
    {
      name: "videos",
      type: "relationship",
      relationTo: "archive-items",
      hasMany: true,
      maxRows: 3,
      label: "فيديوهات",
      filterOptions: { type: { equals: "video" } },
      admin: { description: "ثلاثة فيديوهات من الأرشيف. إن تُركت فارغة ظهرت أحدث ثلاثة." },
    },
    {
      name: "photos",
      type: "relationship",
      relationTo: "archive-items",
      hasMany: true,
      label: "صور من الأرشيف",
      filterOptions: { type: { equals: "photo" } },
      admin: { description: "الصور التي تتقلّب في «صور من الأرشيف». إن تُركت فارغة ظهرت كل صور الأرشيف." },
    },
  ],
};
