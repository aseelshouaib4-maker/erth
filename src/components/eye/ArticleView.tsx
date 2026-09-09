"use client";

import { useRouter } from "next/navigation";
import { eyeCopy, type EyeItem } from "@/data/eye";
import { useReveal } from "@/hooks/useReveal";
import { MediaFrame, ParagraphSlot, Slot } from "@/components/ui/Placeholders";
import { OrnamentGrid } from "@/components/ui/OrnamentGrid";
import { ArrowBackIcon } from "@/components/ui/Icons";
import { TransitionLink } from "@/components/layout/TransitionLink";

/** One article. Every string is a slot until the material arrives. */
export function ArticleView({ item, index }: { item: EyeItem; index: number }) {
  const ref = useReveal<HTMLElement>();
  const router = useRouter();

  return (
    <article ref={ref} className="relative bg-blue">
      <header className="relative overflow-hidden pb-14 pt-32 md:pb-20 md:pt-44">
        <OrnamentGrid scale={2} fade="start" opacity={0.07} />
        <div className="px-gutter relative mx-auto max-w-3xl">
          {/* going back restores the reader's place in the index */}
          <button
            type="button"
            data-reveal
            onClick={() => router.back()}
            className="group inline-flex items-center gap-3 text-[0.72rem] tracking-[0.1em] text-blue-32 transition-colors hover:text-gold"
          >
            <ArrowBackIcon className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
            {eyeCopy.back}
          </button>

          <p data-reveal className="eyebrow mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
            <span className="text-cream/70">مقال</span>
            <span className="text-cream/70">
              <Slot value={item.date} />
            </span>
          </p>

          <h1 data-reveal className="text-display mt-5 text-[clamp(2rem,5vw,3.75rem)] leading-[1.2] text-cream text-balance">
            <Slot value={item.title} className="text-cream" />
          </h1>

          <span data-reveal className="rule-gold mt-7" aria-hidden="true" />

          <div data-reveal className="mt-7 max-w-2xl">
            <ParagraphSlot value={item.excerpt} lines={2} className="text-[0.95rem]" />
          </div>

          <dl data-reveal className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-cream/15 pt-6 sm:grid-cols-4">
            {[
              { label: "الكاتب", value: item.author },
              { label: "المصدر", value: item.source },
              { label: "التاريخ", value: item.date },
              { label: "مدة القراءة", value: item.readingTime },
            ].map((row) => (
              <div key={row.label}>
                <dt className="eyebrow">{row.label}</dt>
                <dd className="mt-1.5 text-[0.85rem] text-cream">
                  <Slot value={row.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="px-gutter mx-auto max-w-3xl pb-24 md:pb-32">
        <div data-reveal>
          <MediaFrame media={item.media} ratio={16 / 9} tone="dark" unitSize="lg" showLabel={false} />
          <p className="mt-4 flex items-center gap-3 text-[0.65rem] tracking-[0.08em] text-blue-54">
            <span className="rule-gold w-6 shrink-0" aria-hidden="true" />
            {item.media.label}
          </p>
        </div>

        <div data-reveal className="mt-14">
          <p className="eyebrow mb-6">المتن</p>
          <div className="space-y-10">
            <ParagraphSlot value={item.body} lines={5} />
            <ParagraphSlot value={item.body} lines={4} />
            <ParagraphSlot value={item.body} lines={5} />
          </div>
        </div>

        <div data-reveal className="mt-16 border-t border-cream/15 pt-8">
          <TransitionLink
            href="/eye"
            className="group inline-flex h-12 items-center gap-3 rounded-ui border border-gold/70 px-6 text-[0.78rem] font-medium tracking-[0.1em] text-gold transition-colors duration-300 hover:bg-gold hover:text-night"
          >
            <ArrowBackIcon className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
            {eyeCopy.back}
          </TransitionLink>
        </div>
      </div>
    </article>
  );
}
