import { media, slot, type MediaPlaceholder, type TextSlot } from "@/lib/placeholder";

/** «عين» — مقالات. كل العناصر خانات بديلة حتى تصل المواد. */
export type EyeItem = {
  id: string;
  title: TextSlot;
  /** وصف مختصر يظهر في الفهرس وأعلى المادة */
  excerpt: TextSlot;
  date: TextSlot;
  source: TextSlot;
  author: TextSlot;
  readingTime: TextSlot;
  /** متن المادة */
  body: TextSlot;
  media: MediaPlaceholder;
};

export const eyeItems: EyeItem[] = Array.from({ length: 9 }, (_, i) => ({
  id: `eye-${i + 1}`,
  title: slot("عنوان المقال"),
  excerpt: slot("وصف مختصر"),
  date: slot("التاريخ"),
  source: slot("المصدر"),
  author: slot("الكاتب"),
  readingTime: slot("مدة القراءة"),
  body: slot("متن المقال"),
  media: media("image", `مقال — صورة ${String(i + 1).padStart(2, "0")}`, i % 3 === 0 ? 16 / 9 : 4 / 3),
}));

export const eyeItemById = (id: string) => eyeItems.find((i) => i.id === id);

export const eyeCopy = {
  title: "عين",
  eyebrow: "مقالات",
  lead: slot("نصّ تعريفي بقسم عين"),
  read: "اقرأ المادة",
  back: "عودة إلى عين",
} as const;
