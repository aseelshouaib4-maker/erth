import { media, slot, type MediaPlaceholder, type TextSlot } from "@/lib/placeholder";

/**
 * UI-only mock for the video-answer assistant being built by the AI team.
 * The shapes below are what the real API is expected to return; only the
 * presentation lives in the frontend.
 */

export type RelatedLink = { label: string; href: string };

export type ResultItem = {
  id: string;
  kind: "video" | "photo" | "document" | "section";
  title: TextSlot | string;
  meta?: string;
  href: string;
  media: MediaPlaceholder;
};

export type AssistantAnswer = {
  id: string;
  /** الإجابة الأساسية: مقطع فيديو */
  video: MediaPlaceholder;
  title: TextSlot;
  /** بيانات المقطع */
  duration: TextSlot;
  source: TextSlot;
  /** نصّ مرافق (تفريغ أو ملخّص) */
  summary: TextSlot;
  /** ربط بالأقسام المتصلة في الموقع */
  related: RelatedLink[];
  /** نتائج إضافية */
  results?: ResultItem[];
};

export type ChatMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; answer: AssistantAnswer }
  | { id: string; role: "assistant"; typing: true };

export const suggestedQuestions: string[] = [
  "من هو حسن نصر الله؟",
  "أخبرني المزيد عن حياته.",
  "ما أبرز محطات مسيرته؟",
  "أرني خطاباته.",
  "حدّثني عن هذه اللحظة.",
];

const results = (prefix: string): ResultItem[] => [
  {
    id: `${prefix}-r1`,
    kind: "video",
    title: slot("عنوان المقطع"),
    meta: "فيديو",
    href: "/speeches",
    media: media("video", "مقطع مقترح", 16 / 9),
  },
  {
    id: `${prefix}-r2`,
    kind: "photo",
    title: slot("عنوان الصورة"),
    meta: "صورة",
    href: "/gallery",
    media: media("image", "صورة مقترحة", 4 / 5),
  },
  {
    id: `${prefix}-r3`,
    kind: "document",
    title: slot("عنوان الوثيقة"),
    meta: "وثيقة",
    href: "/archive",
    media: media("document", "وثيقة مقترحة", 3 / 4),
  },
];

const answer = (id: string, related: RelatedLink[], withResults = true): AssistantAnswer => ({
  id,
  video: media("video", "الإجابة بالفيديو", 16 / 9),
  title: slot("عنوان مقطع الإجابة"),
  duration: slot("المدة"),
  source: slot("المصدر"),
  summary: slot("ملخّص الإجابة أو تفريغ المقطع"),
  related,
  results: withResults ? results(id) : undefined,
});

/** Mock answers keyed by suggested question. Unknown questions get the generic answer. */
export const mockAnswers: Record<string, AssistantAnswer> = {
  "من هو حسن نصر الله؟": answer("who", [
    { label: "المولد والنشأة", href: "/biography#birth" },
    { label: "السيرة", href: "/biography" },
  ]),
  "أخبرني المزيد عن حياته.": answer("life", [
    { label: "السيرة الكاملة", href: "/biography" },
    { label: "القصة", href: "/story" },
  ]),
  "ما أبرز محطات مسيرته؟": answer("moments", [
    { label: "محطات مهمة", href: "/biography" },
    { label: "تدرّج المواقع إلى الأمانة العامة", href: "/biography#secretary-general" },
  ]),
  "أرني خطاباته.": answer("work", [
    { label: "الخطابات والمحاضرات", href: "/archive?type=speech" },
    { label: "المرئيات", href: "/#media" },
  ]),
  "حدّثني عن هذه اللحظة.": answer("moment", [
    { label: "في حوزة النجف", href: "/biography#najaf" },
    { label: "الأرشيف", href: "/archive" },
  ]),
};

export const genericAnswer: AssistantAnswer = answer("generic", [
  { label: "السيرة", href: "/biography" },
  { label: "الأرشيف", href: "/archive" },
]);

export const chatCopy = {
  greeting: "اسأل عن أي مرحلة أو لحظة، وستكون الإجابة مقطعًا من الأرشيف.",
  typing: "يبحث في الأرشيف…",
  relatedLabel: "أقسام متصلة",
  resultsLabel: "نتائج أخرى",
  videoAnswerLabel: "إجابة بالفيديو",
  note: "واجهة تجريبية — الإجابات هنا نماذج عرض، والربط بالمساعد الفعلي يتم لاحقًا.",
} as const;
