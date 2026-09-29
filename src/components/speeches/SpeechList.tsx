"use client";

import { useRef, useState } from "react";
import { speechItems, type SpeechItem } from "@/data/speeches";
import { stageById } from "@/data/person";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn, formatYear, prefersReducedMotion } from "@/lib/utils";
import { MediaFrame, ParagraphSlot, Slot } from "@/components/ui/Placeholders";
import { PlayIcon } from "@/components/ui/Icons";

/**
 * خطابات: one large player, then a numbered list with thumbnails.
 * Used whole by «/speeches» and, unchanged, by the خطابات filter inside «أرشيف»
 * — which passes the speeches its own date filter has kept.
 */
export function SpeechList({ items = speechItems }: { items?: SpeechItem[] } = {}) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const listRef = useRef<HTMLDivElement>(null);

  /* the chosen speech may be filtered away — fall back to the first one left */
  const active = items.find((w) => w.id === activeId) ?? items[0];

  const stage = active ? stageById(active.stageId) : undefined;

  useGSAP(
    () => {
      const rows = listRef.current?.querySelectorAll("[data-row]");
      if (!rows?.length || prefersReducedMotion()) return;
      gsap.fromTo(rows, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: "power3.out" });
    },
    { scope: listRef },
  );

  if (!active) return null;

  return (
    <div className="px-gutter bg-blue py-12 md:py-20">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <MediaFrame key={active.id} media={active.media} ratio={16 / 9} tone="dark" unitSize="lg" interactive />
        </div>
        <div className="flex flex-col justify-end lg:col-span-4">
          <p className="eyebrow">خطاب · {formatYear(active.year)}</p>
          <h2 className="text-heading mt-4 text-[clamp(1.5rem,2.6vw,2.2rem)] text-cream">
            <Slot value={active.title} />
          </h2>
          {stage && <p className="mt-3 text-[0.85rem] text-blue-32">{stage.title}</p>}
          <div className="mt-6">
            <ParagraphSlot value={active.excerpt} lines={4} />
          </div>
          <p className="mt-6 text-[0.7rem] tracking-[0.1em] text-blue-54">
            المدة: <Slot value={active.duration} />
          </p>
        </div>
      </div>

      <div ref={listRef} className="mt-20">
        <p className="eyebrow mb-4 tabular-nums">{items.length} خطاباً</p>
        <ol>
          {items.map((item, i) => {
            const s = stageById(item.stageId);
            const isActive = item.id === active.id;
            return (
              <li key={item.id} id={item.id} data-row>
                <button
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={cn(
                    "group grid w-full grid-cols-[2.5rem_1fr] items-center gap-4 border-t border-cream/10 py-5 text-start transition-colors md:grid-cols-[3rem_10rem_1fr_auto] md:gap-6",
                    isActive ? "text-gold" : "text-cream/85 hover:text-cream",
                  )}
                >
                  <span className="text-display text-[1.3rem] leading-none tabular-nums text-current/70">{String(i + 1).padStart(2, "0")}</span>
                  <span className="hidden md:block">
                    <MediaFrame media={item.media} ratio={16 / 9} tone="dark" unitSize="sm" showLabel={false} interactive className="w-40" />
                  </span>
                  <span className="min-w-0">
                    <span className="text-heading block text-[1.05rem] md:text-[1.2rem]">
                      <Slot value={item.title} className={isActive ? "text-gold" : undefined} />
                    </span>
                    <span className="mt-1 block truncate text-[0.68rem] tracking-[0.1em] text-blue-54">
                      {formatYear(item.year)} · {s?.title}
                    </span>
                  </span>
                  <span className="hidden items-center gap-3 text-[0.68rem] tracking-[0.1em] text-blue-54 md:flex">
                    <Slot value={item.duration} />
                    <span
                      className={cn(
                        "inline-flex h-10 w-10 items-center justify-center border transition-colors duration-300",
                        isActive ? "border-gold text-gold" : "border-cream/20 text-cream",
                        "group-hover:border-gold group-hover:bg-gold group-hover:text-night group-focus-visible:border-gold group-focus-visible:bg-gold group-focus-visible:text-night",
                      )}
                    >
                      <PlayIcon className="h-4 w-4 -scale-x-100" />
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
          <li className="border-t border-cream/10" />
        </ol>
      </div>
    </div>
  );
}
