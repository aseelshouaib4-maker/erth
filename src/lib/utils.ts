export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Arabic-Indic digits are not used: the style guide sets data in Cairo with Western numerals. */
export function formatYear(year?: number) {
  return year === undefined ? "—" : String(year);
}

export const INTRO_STORAGE_KEY = "erth:intro-seen";

export function hasSeenIntro() {
  try {
    return window.localStorage.getItem(INTRO_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen() {
  try {
    window.localStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {
    /* storage unavailable: intro simply shows again next time */
  }
}
