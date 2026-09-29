"use client";

import { useRef } from "react";
import { eyeCopy, eyeItems } from "@/data/eye";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { MediaFrame, ParagraphSlot, Slot } from "@/components/ui/Placeholders";
import { ArrowIcon } from "@/components/ui/Icons";

/** Articles, as an editorial index rather than a card grid. */
export function EyeIndex() {
  const listRef = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const rows = listRef.current?.querySelectorAll("[data-row]");
      if (!rows?.length || prefersReducedMotion()) return;
      gsap.fromTo(rows, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: "power3.out" });
    },
    { scope: listRef },
  );

  return (
    <section className="relative bg-blue py-20 md:py-28">
      <div className="px-gutter">
        <div className="flex flex-wrap items-baseline justify-between gap-6 border-b border-cream/15 pb-6">
          <p className="eyebrow tracking-sep">{eyeCopy.eyebrow}</p>
          <p className="eyebrow tabular-nums">{eyeItems.length} مادة</p>
        </div>

        <ol ref={listRef}>
          {eyeItems.map((item, i) => (
            <li key={item.id} id={item.id} data-row>
              <article className="group grid grid-cols-1 items-start gap-6 border-b border-cream/10 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                <div className="flex items-baseline gap-4 md:col-span-2">
                  <span className="text-display text-[1.2rem] leading-none text-blue-54 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="eyebrow">مقال</span>
                </div>

                <div className="md:col-span-6">
                  <h2 className="text-heading text-[1.25rem] leading-[1.4] text-cream transition-colors duration-300 group-hover:text-gold md:text-[1.6rem]">
                    <Slot value={item.title} />
                  </h2>
                  <div className="mt-4 max-w-xl">
                    <ParagraphSlot value={item.excerpt} lines={2} className="text-[0.85rem]" />
                  </div>
                  <p className="mt-4 flex flex-wrap items-center gap-x-3 text-[0.68rem] tracking-[0.1em] text-blue-54">
                    <Slot value={item.date} />
                    <span aria-hidden="true">·</span>
                    <Slot value={item.source} />
                  </p>
                </div>

                {/* image, then the call to action directly beneath it */}
                <div className="md:col-span-4">
                  <MediaFrame media={item.media} ratio={item.media.ratio} tone="dark" unitSize="sm" interactive showLabel={false} />
                  <TransitionLink
                    href={`/eye/${item.id}`}
                    className="mt-4 inline-flex h-11 w-full items-center justify-center gap-3 rounded-ui border border-gold px-5 text-[0.75rem] font-medium tracking-[0.1em] text-gold transition-colors duration-300 hover:bg-gold hover:text-night focus-visible:bg-gold focus-visible:text-night active:bg-gold active:text-night sm:w-auto"
                  >
                    {eyeCopy.read}
                    <ArrowIcon className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1" />
                  </TransitionLink>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
