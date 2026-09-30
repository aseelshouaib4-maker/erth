"use client";

import { useState } from "react";
import { speechItems } from "@/data/speeches";
import { stageById } from "@/data/person";
import { ui } from "@/data/site";
import { useReveal } from "@/hooks/useReveal";
import { cn, formatYear } from "@/lib/utils";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { MediaFrame, Slot } from "@/components/ui/Placeholders";
import { ArrowIcon } from "@/components/ui/Icons";

const featured = speechItems.slice(0, 5);

/** Video-led: one large player, a playlist beside it. Hovering a row swaps the preview. */
export function SelectedSpeeches() {
  const ref = useReveal<HTMLElement>();
  const [active, setActive] = useState(0);
  const current = featured[active];
  const stage = stageById(current.stageId);

  return (
    <section ref={ref} className="relative bg-blue-dark pb-24 pt-16 md:pb-36 md:pt-24">
      <div className="px-gutter">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeader eyebrow="مختارات" title="خطابات" size="lg" display />
          <div data-reveal>
            <Button href="/archive?type=speech" variant="link" arrow>
              {ui.viewAll}
            </Button>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div data-reveal className="lg:col-span-7">
            <MediaFrame key={current.id} media={current.media} ratio={16 / 9} tone="blue" unitSize="lg" interactive />
            <div className="mt-5 flex flex-wrap items-baseline justify-between gap-4">
              <h3 className="text-heading text-[1.25rem] text-cream md:text-[1.5rem]">
                <Slot value={current.title} />
              </h3>
              <p className="text-[0.7rem] tracking-[0.1em] text-blue-54">
                خطاب · {formatYear(current.year)} · <Slot value={current.duration} />
              </p>
            </div>
            {stage && <p className="mt-2 text-[0.8rem] text-blue-32">{stage.title}</p>}
          </div>

          <ol className="lg:col-span-5" aria-label="قائمة التشغيل">
            {featured.map((item, i) => (
              <li key={item.id} data-reveal>
                <TransitionLink
                  href={`/speeches#${item.id}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={cn(
                    "group flex items-center gap-5 border-t border-cream/10 py-5 transition-colors",
                    i === active ? "text-gold" : "text-cream/85 hover:text-cream",
                  )}
                >
                  <span className="eyebrow w-8 tabular-nums text-current/70">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="text-heading block truncate text-[1.05rem]">
                      <Slot value={item.title} className={i === active ? "text-gold" : undefined} />
                    </span>
                    <span className="mt-1 block text-[0.68rem] tracking-[0.1em] text-blue-54">
                      خطاب · {formatYear(item.year)} · <Slot value={item.duration} />
                    </span>
                  </span>
                  <ArrowIcon
                    className={cn(
                      "h-4 w-4 transition-all duration-500 ease-out-expo",
                      i === active ? "-translate-x-1 opacity-100" : "opacity-0 group-hover:opacity-100",
                    )}
                  />
                </TransitionLink>
              </li>
            ))}
            <li className="border-t border-cream/10" />
          </ol>
        </div>
      </div>
    </section>
  );
}
