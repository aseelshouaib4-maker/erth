"use client";

import { useMemo, useRef, useState } from "react";
import {
  countIn,
  libraryCategories,
  libraryCategoryLabel,
  libraryItems,
  titleCount,
  type LibraryCategory,
} from "@/data/library";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReveal } from "@/hooks/useReveal";
import { cn, prefersReducedMotion } from "@/lib/utils";
import { MediaFrame, ParagraphSlot, Slot } from "@/components/ui/Placeholders";
import { OrnamentGrid } from "@/components/ui/OrnamentGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** دار النشر: بابان — مؤلفات الدار، ومؤلفات عن السيد. Covers are placeholders. */
export function LibraryShelf() {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.05 });
  /* لا بابَ مفتوحًا قبل أن يختار الزائر: البطاقتان محايدتان، والفهرس يعرض الكل */
  const [category, setCategory] = useState<LibraryCategory | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => (category ? libraryItems.filter((b) => b.category === category) : libraryItems), [category]);
  const featured = items[0];
  const key = items.map((i) => i.id).join("|");

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cells = gridRef.current?.querySelectorAll("[data-book]");
      if (cells?.length) {
        gsap.fromTo(cells, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.04, ease: "power3.out", overwrite: true });
      }
      /* المؤلَّف المختار يتبدّل مع الباب، فيعبر بتلاشٍ قصير بدل أن يقفز */
      if (featuredRef.current) {
        gsap.fromTo(featuredRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", overwrite: true });
      }
    },
    { dependencies: [key] },
  );

  return (
    <div ref={ref}>
      {/* البابان — شريطان مضغوطان، حتى يبقى الفهرس تحتهما في مدى النظر */}
      <section className="relative bg-blue pb-10 md:pb-14" aria-label="اختر الباب">
        <div className="px-gutter">
          <div data-reveal className="grid gap-3 md:grid-cols-2 md:gap-4">
            {libraryCategories.map((c) => {
              const isActive = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory((current) => (current === c.id ? null : c.id))}
                  aria-pressed={isActive}
                  aria-controls="library-index"
                  className={cn(
                    "group relative flex items-center justify-between gap-5 overflow-hidden rounded-ui border px-5 py-4 text-start transition-[border-color,background-color] duration-500 ease-out-expo md:px-6 md:py-5",
                    /* الإضاءة نفسها في الحالتين: عند المرور، وعند الاختيار */
                    isActive
                      ? "border-gold/55 bg-blue-dark"
                      : "border-cream/12 hover:border-gold/55 hover:bg-blue-dark",
                  )}
                >
                  {/* نقطة الضوء: خيط ذهبي يُرسم على الحافة العليا */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 top-0 h-0.5 origin-right bg-gold transition-transform duration-700 ease-out-expo",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />

                  <span className="min-w-0">
                    <span
                      className={cn(
                        "text-heading block truncate text-[1.02rem] transition-colors duration-300 md:text-[1.15rem]",
                        isActive ? "text-cream" : "text-cream/65 group-hover:text-cream",
                      )}
                    >
                      {c.label}
                    </span>
                    <span className="mt-1 block truncate text-[0.68rem] tracking-[0.08em] text-blue-54">{c.note}</span>
                  </span>

                  <span
                    className={cn(
                      "shrink-0 text-[0.7rem] tracking-[0.1em] tabular-nums transition-colors duration-500",
                      isActive ? "text-gold" : "text-blue-54 group-hover:text-gold",
                    )}
                  >
                    {titleCount(countIn(c.id))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* featured volume of the chosen door */}
      {featured && (
        <section className="relative overflow-hidden bg-blue-dark py-14 md:py-20">
          <OrnamentGrid scale={2} fade="start" opacity={0.07} />
          <div ref={featuredRef} className="px-gutter relative grid gap-10 md:grid-cols-12 md:items-center md:gap-8">
            <div key={`${featured.id}-cover`} data-reveal className="md:col-span-4 lg:col-span-3">
              <MediaFrame media={featured.media} ratio={3 / 4} tone="night" unitSize="md" interactive />
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p data-reveal className="eyebrow">
                مؤلَّف مختار
              </p>
              <h2 data-reveal className="text-heading mt-4 text-[clamp(1.6rem,3.4vw,2.8rem)] text-cream">
                <Slot value={featured.title} />
              </h2>
              <span data-reveal className="rule-gold mt-5" aria-hidden="true" />
              <div data-reveal className="mt-6 max-w-xl">
                <ParagraphSlot value={featured.summary} lines={3} />
              </div>
              <dl data-reveal className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
                {[
                  { label: "المؤلِّف", value: featured.author },
                  { label: "سنة النشر", value: featured.year },
                  { label: "الناشر", value: featured.publisher },
                  { label: "عدد الصفحات", value: featured.pages },
                ].map((row) => (
                  <div key={row.label} className="border-t border-cream/15 pt-3">
                    <dt className="eyebrow">{row.label}</dt>
                    <dd className="mt-1 text-[0.85rem] text-cream">
                      <Slot value={row.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      )}

      {/* the shelf */}
      <section id="library-index" className="bg-blue py-20 md:py-28">
        <div className="px-gutter">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-cream/15 pb-6">
            <SectionHeader eyebrow="الفهرس" title={category ? libraryCategoryLabel[category] : "كل المؤلفات"} size="md" />
            <p className="eyebrow tabular-nums" aria-live="polite">
              {titleCount(items.length)}
            </p>
          </div>

          <div ref={gridRef} className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {items.map((book, i) => (
              <article key={book.id} id={book.id} data-book className="group">
                <MediaFrame media={book.media} ratio={3 / 4} tone="dark" unitSize="sm" interactive showLabel={false} />
                <h3 className="mt-4 text-[0.9rem] leading-[1.6] text-cream transition-colors duration-300 group-hover:text-gold">
                  <Slot value={book.title} />
                </h3>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[0.65rem] tracking-[0.1em] text-blue-54">
                  <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  {/* البابان معًا: يحتاج العنوان أن يقول من أيّهما جاء */}
                  {!category && (
                    <>
                      <span aria-hidden="true">·</span>
                      {libraryCategoryLabel[book.category]}
                    </>
                  )}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
