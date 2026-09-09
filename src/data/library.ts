import { media, slot, type MediaPlaceholder, type TextSlot } from "@/lib/placeholder";

/** «دار النشر» — مؤلفات الدار وما كُتب عن السيد. كل العناصر خانات بديلة حتى تصل البيانات. */
export type LibraryCategory = "works" | "about";

/**
 * بابان اثنان لا غير: يختار الزائر أحدهما عند دخول الصفحة.
 */
export const libraryCategories: { id: LibraryCategory; label: string; note: string }[] = [
  { id: "works", label: "مؤلفات دار النشر", note: "ما أصدرته الدار" },
  { id: "about", label: "مؤلفات عن السيد", note: "ما كُتب عنه" },
];

export const libraryCategoryLabel: Record<LibraryCategory, string> = {
  works: "مؤلفات دار النشر",
  about: "مؤلفات عن السيد",
};

export type LibraryItem = {
  id: string;
  category: LibraryCategory;
  title: TextSlot;
  author: TextSlot;
  year: TextSlot;
  publisher: TextSlot;
  pages: TextSlot;
  summary: TextSlot;
  /** غلاف الكتاب */
  media: MediaPlaceholder;
};

const make = (i: number, category: LibraryCategory): LibraryItem => ({
  id: `book-${i}`,
  category,
  title: slot("عنوان المؤلَّف"),
  author: slot("المؤلِّف"),
  year: slot("سنة النشر"),
  publisher: slot("الناشر"),
  pages: slot("عدد الصفحات"),
  summary: slot("نبذة"),
  media: media("document", `غلاف المؤلَّف ${String(i).padStart(2, "0")}`, 3 / 4),
});

export const libraryItems: LibraryItem[] = Array.from({ length: 12 }, (_, i) => make(i + 1, i < 7 ? "works" : "about"));

export const featuredBook: LibraryItem = libraryItems[0];

/** عدد العناوين خلف كل باب — يُشتقّ من اللائحة نفسها. */
export const countIn = (category: LibraryCategory) => libraryItems.filter((b) => b.category === category).length;

/** تمييز العدد: 3–10 جمع قلّة، وما فوقها مفرد منصوب. */
export const titleCount = (n: number) =>
  n === 1 ? "عنوان واحد" : n === 2 ? "عنوانان" : n <= 10 ? `${n} عناوين` : `${n} عنوانًا`;

export const libraryCopy = {
  title: "دار النشر",
  eyebrow: "مؤلفات الدار وما كُتب عن السيد",
  lead: slot("نصّ تعريفي بدار النشر"),
} as const;
