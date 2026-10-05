import type { LibraryCategory } from "@/lib/content/types";

/** «دار النشر» — interface copy and the two doors. The books come from the CMS. */

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

/** تمييز العدد: 3–10 جمع قلّة، وما فوقها مفرد منصوب. */
export const titleCount = (n: number) =>
  n === 1 ? "عنوان واحد" : n === 2 ? "عنوانان" : n <= 10 ? `${n} عناوين` : `${n} عنوانًا`;

export const libraryCopy = {
  title: "دار النشر",
  eyebrow: "مؤلفات الدار وما كُتب عن السيد",
} as const;
