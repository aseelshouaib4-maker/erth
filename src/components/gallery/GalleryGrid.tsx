"use client";

import { useState } from "react";
import { galleryItems } from "@/data/gallery";
import { stageById } from "@/data/person";
import { useParallax } from "@/hooks/useParallax";
import { useReveal } from "@/hooks/useReveal";
import { cn, formatYear } from "@/lib/utils";
import { MediaFrame, Slot } from "@/components/ui/Placeholders";
import { Lightbox } from "./Lightbox";

const spans: Record<number, string> = {
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
};

const offsets = ["", "md:mt-20", "md:mt-8", "md:-mt-12", "md:mt-16", "", "md:mt-24", "md:-mt-8"];
const speeds = [0.1, 0.25, 0.16, 0.08, 0.28, 0.12, 0.2, 0.3];

/** Asymmetric, variable-size gallery with a fullscreen viewer. */
export function GalleryGrid() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const revealRef = useReveal<HTMLDivElement>({ stagger: 0.05 });
  const parallaxRef = useParallax<HTMLDivElement>();

  return (
    <>
      <div ref={revealRef}>
        <div ref={parallaxRef} className="px-gutter grid grid-cols-2 gap-5 py-16 md:grid-cols-12 md:items-start md:gap-6 md:py-24">
          {galleryItems.map((item, i) => {
            const stage = stageById(item.stageId);
            return (
              <div key={item.id} id={item.id} data-reveal data-parallax={speeds[i % speeds.length]} className={cn(spans[item.span], offsets[i % offsets.length], item.span >= 7 && "col-span-2")}>
                <button
                  type="button"
                  onClick={() => {
                    setIndex(i);
                    setOpen(true);
                  }}
                  className="group block w-full text-start"
                  aria-label={`فتح الصورة ${i + 1}`}
                >
                  <MediaFrame media={item.media} ratio={item.ratio} tone="dark" interactive showLabel={false} />
                  <div className="mt-3 flex items-baseline justify-between gap-3 text-[0.72rem] tracking-[0.08em]">
                    <span className="text-cream/85 transition-colors group-hover:text-gold">
                      <Slot value={item.caption} />
                    </span>
                    <span className="shrink-0 text-blue-54 tabular-nums">{formatYear(item.year)}</span>
                  </div>
                  {stage && <p className="mt-1 truncate text-[0.68rem] text-blue-54">{stage.title}</p>}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <Lightbox open={open} index={index} onClose={() => setOpen(false)} onChange={setIndex} />
    </>
  );
}
