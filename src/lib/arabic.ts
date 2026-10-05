/** Arabic search needs the obvious equivalences or nothing ever matches. */
export function normalizeArabic(value: string) {
  return value
    .replace(/[ً-ْٰـ]/g, "")
    .replace(/[آأإٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[«»"'.,:;!؟?()\[\]—–-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
