import type { GlobalConfig } from "payload";
import { anyone, staff } from "../access";
import { GROUPS } from "../groups";
import { revalidateGlobal } from "../hooks/revalidate";

const url = (name: string, label: string) =>
  ({ name, type: "text", label, admin: { rtl: false, width: "50%" } }) as const;

/** Contact details and social accounts shown in the footer and on «تواصل». */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "إعدادات الموقع",
  admin: { group: GROUPS.settings },
  access: { read: anyone, update: staff },
  hooks: revalidateGlobal("site-settings"),
  fields: [
    {
      type: "row",
      fields: [
        { name: "email", type: "email", label: "البريد الإلكتروني", required: true, admin: { width: "34%" } },
        {
          name: "phone",
          type: "text",
          label: "الهاتف",
          admin: { width: "33%", rtl: false, description: "مع رمز البلد، مثل: +961 1 234 567" },
        },
        {
          name: "whatsapp",
          type: "text",
          label: "واتساب",
          admin: { width: "33%", rtl: false, description: "إن اختلف عن الهاتف" },
        },
      ],
    },
    {
      name: "socials",
      type: "group",
      label: "حسابات التواصل",
      admin: { description: "الرابط الكامل لكل حساب. ما يُترك فارغًا يظهر رمزه بلا رابط." },
      fields: [
        {
          type: "row",
          fields: [url("facebook", "فيسبوك"), url("instagram", "إنستغرام")],
        },
        {
          type: "row",
          fields: [url("x", "إكس"), url("youtube", "يوتيوب")],
        },
        {
          type: "row",
          fields: [url("telegram", "تلغرام"), url("whatsapp", "واتساب")],
        },
      ],
    },
  ],
};
