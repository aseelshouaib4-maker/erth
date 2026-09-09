import { media, slot, type MediaPlaceholder, type TextSlot } from "@/lib/placeholder";

/** «فيديوهات» على الصفحة الرئيسية: مقابلات ومحاضرات. */
export type MediaKind = "interview" | "lecture";

export const mediaKindLabel: Record<MediaKind, string> = {
  interview: "مقابلة",
  lecture: "محاضرة",
};

export type MediaItem = {
  id: string;
  kind: MediaKind;
  title: TextSlot;
  duration: TextSlot;
  year?: TextSlot;
  media: MediaPlaceholder;
};

/**
 * الصفحة الرئيسية تعرض ثلاثة فيديوهات فقط؛ بقيّة المواد في «أرشيف».
 */
const kinds: MediaKind[] = ["interview", "interview", "lecture"];

export const homeVideos: MediaItem[] = kinds.map((kind, i) => ({
  id: `home-video-${i + 1}`,
  kind,
  title: slot(`عنوان ${mediaKindLabel[kind]}`),
  duration: slot("المدة"),
  year: slot("السنة"),
  media: media("video", mediaKindLabel[kind], 16 / 9),
}));
