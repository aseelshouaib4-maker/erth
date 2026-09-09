import { media, slot, type MediaPlaceholder, type TextSlot } from "@/lib/placeholder";
import { moments, stages } from "./person";
import { speechItems } from "./speeches";

/** الأرشيف: صور وفيديوهات ونصوص وخطابات */
export type ArchiveType = "photo" | "video" | "text" | "speech";
/** الفيديوهات: مقابلات ومحاضرات */
export type VideoKind = "interview" | "lecture";

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

export type ArchiveItem = {
  id: string;
  type: ArchiveType;
  title: TextSlot;
  stageId: string;
  year?: number;
  /** grid footprint */
  size: "sm" | "md" | "lg" | "tall" | "wide";
  /** videos only */
  kind?: VideoKind;
  /**
   * Path to the downloadable file. Left undefined until the real assets are
   * uploaded; the download control shows its waiting state meanwhile.
   */
  src?: string;
  media: MediaPlaceholder;
};

const typeLabel: Record<ArchiveType, string> = {
  photo: "صورة",
  video: "فيديو",
  text: "نصّ",
  speech: "خطاب",
};

export const archiveTypeLabel = (t: ArchiveType) => typeLabel[t];

const photoSizes: ArchiveItem["size"][] = ["lg", "sm", "tall", "md", "wide", "sm", "md", "tall", "sm", "lg", "md", "sm"];

/** 14 صور */
const photos: ArchiveItem[] = Array.from({ length: 14 }, (_, i) => {
  const stage = stages[i % stages.length];
  const size = photoSizes[i % photoSizes.length];
  return {
    id: `photo-${i + 1}`,
    type: "photo" as const,
    title: slot("عنوان الصورة"),
    stageId: stage.id,
    year: stage.yearFrom,
    size,
    media: media("image", `صورة — ${stage.title}`, size === "tall" ? 3 / 4 : size === "wide" ? 16 / 9 : 1),
  };
});

/** 8 فيديوهات: مقابلات ومحاضرات */
const videos: ArchiveItem[] = Array.from({ length: 8 }, (_, i) => {
  const stage = stages[(i + 3) % stages.length];
  const kind: VideoKind = i % 2 === 0 ? "interview" : "lecture";
  return {
    id: `video-${i + 1}`,
    type: "video" as const,
    title: slot(`عنوان ${videoKindLabel[kind]}`),
    stageId: stage.id,
    year: stage.yearFrom,
    size: "wide" as const,
    kind,
    media: media("video", `${videoKindLabel[kind]} — ${stage.title}`, 16 / 9),
  };
});

/** 8 نصوص ووثائق */
const texts: ArchiveItem[] = Array.from({ length: 8 }, (_, i) => {
  const stage = stages[(i + 6) % stages.length];
  return {
    id: `text-${i + 1}`,
    type: "text" as const,
    title: slot("عنوان النصّ"),
    stageId: stage.id,
    year: stage.yearFrom,
    size: i % 3 === 0 ? ("md" as const) : ("tall" as const),
    media: media("document", `نصّ — ${stage.title}`, 3 / 4),
  };
});

/**
 * الخطابات نفسها التي تعرضها لائحة «خطابات»، معروضة هنا كنوع رابع من الأرشيف.
 * المصدر واحد — «@/data/speeches» — حتى لا تفترق اللائحتان.
 */
const speeches: ArchiveItem[] = speechItems.map((s) => ({
  id: s.id,
  type: "speech" as const,
  title: s.title,
  stageId: s.stageId,
  year: s.year,
  size: "wide" as const,
  media: s.media,
}));

export const archiveItems: ArchiveItem[] = [...photos, ...videos, ...texts, ...speeches];

/** photographs, used by the homepage fan */
export const archivePhotos = photos;

/**
 * الاقتراحات التي تظهر تحت حقل البحث لتدلّ الزائر على ما يمكن سؤاله.
 * كلّها مقتطعة من نصوص موجودة فعلاً في الموقع (عناوين المراحل ومحطّاتها)،
 * حتى لا يقود اقتراحٌ إلى نتيجة فارغة.
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

/** يُستعمل في الاختبار اليدوي: كل اقتراح يجب أن يطابق مادّة واحدة على الأقل. */
export const suggestionSources = [...stages.map((s) => s.title), ...moments.map((m) => m.label)];
