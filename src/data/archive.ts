import type { ArchiveType, VideoKind } from "@/lib/content/types";

/** Archive filters and labels. The items themselves come from the CMS. */

export const archiveTypes: { id: ArchiveType | "all"; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "photo", label: "صور" },
  { id: "video", label: "فيديوهات" },
  { id: "text", label: "نصوص" },
  { id: "speech", label: "خطابات" },
];

export const videoKindLabel: Record<VideoKind, string> = {
  interview: "مقابلة",
  lecture: "محاضرة",
};

export const archivePeriods: { id: string; label: string; from?: number; to?: number }[] = [
  { id: "all", label: "كل الفترات" },
  { id: "1950s", label: "1959 – 1975", from: 1959, to: 1975 },
  { id: "1970s", label: "1976 – 1985", from: 1976, to: 1985 },
  { id: "1990s", label: "1985 – 2000", from: 1985, to: 2000 },
  { id: "2000s", label: "2000 – 2024", from: 2000, to: 2024 },
];

const typeLabel: Record<ArchiveType, string> = {
  photo: "صورة",
  video: "فيديو",
  text: "نصّ",
  speech: "خطاب",
};

export const archiveTypeLabel = (t: ArchiveType) => typeLabel[t];

/**
 * الاقتراحات التي تظهر تحت حقل البحث لتدلّ الزائر على ما يمكن سؤاله.
 * كلّها مقتطعة من عناوين المراحل ومحطّاتها، حتى لا يقود اقتراحٌ إلى نتيجة فارغة.
 */
export const archiveSuggestions: string[] = [
  "المولد والنشأة",
  "حوزة النجف",
  "في حوزة البقاع",
  "تأسيس حزب الله",
  "الأمانة العامة",
  "انسحاب 2000",
  "حرب تموز 2006",
  "حرب غزة",
  "السياسة الإقليمية",
  "الوفاة",
];
