import type { Condition, GroupField, TextFieldSingleValidation } from "payload";
import { parseVideoLink, SUPPORTED_VIDEO_LINKS } from "@/lib/video";

export type VideoSource = "link" | "upload";

const validateLink: TextFieldSingleValidation = (value, { siblingData }) => {
  const source = (siblingData as { source?: VideoSource } | undefined)?.source;
  if (source === "upload" || !value) return true;
  return parseVideoLink(value) ? true : `رابط غير مدعوم. الروابط المقبولة: ${SUPPORTED_VIDEO_LINKS}`;
};

/**
 * One video, from either source: a link (YouTube, Vimeo, Facebook or a direct
 * file) or a file uploaded to the server. Every place on the site that plays a
 * video uses this field, so editors meet the same choice everywhere.
 */
export function videoField({ name = "video", condition }: { name?: string; condition?: Condition } = {}): GroupField {
  return {
    name,
    type: "group",
    label: "الفيديو",
    admin: { condition },
    fields: [
      {
        name: "source",
        type: "radio",
        label: "مصدر الفيديو",
        defaultValue: "link",
        options: [
          { label: "رابط", value: "link" },
          { label: "رفع ملف فيديو", value: "upload" },
        ],
        admin: { layout: "horizontal" },
      },
      {
        name: "url",
        type: "text",
        label: "رابط الفيديو",
        validate: validateLink,
        admin: {
          condition: (_, sibling) => sibling?.source !== "upload",
          description: SUPPORTED_VIDEO_LINKS,
          rtl: false,
        },
      },
      {
        name: "file",
        type: "upload",
        relationTo: "videos",
        label: "ملف الفيديو",
        admin: {
          condition: (_, sibling) => sibling?.source === "upload",
          description: "اختر ملفًا من مكتبة الفيديو أو ارفع ملفًا جديدًا (MP4 أو WebM).",
        },
      },
      {
        name: "poster",
        type: "upload",
        relationTo: "media",
        label: "صورة الغلاف",
        admin: {
          description: "اختيارية. تظهر قبل التشغيل. روابط YouTube تأتي بصورتها تلقائيًا.",
        },
      },
    ],
  };
}
