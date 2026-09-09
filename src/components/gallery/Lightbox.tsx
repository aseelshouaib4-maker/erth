"use client";

import { useEffect, useRef } from "react";
import { galleryItems } from "@/data/gallery";
import { stageById } from "@/data/person";
import { ui } from "@/data/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { formatYear, prefersReducedMotion } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { MediaFrame, Slot } from "@/components/ui/Placeholders";
import { ArrowBackIcon, ArrowIcon, CloseIcon } from "@/components/ui/Icons";

type Props = { open: boolean; index: number; onClose: () => void; onChange: (i: number) => void };

/** Fullscreen viewer with keyboard navigation and directional slide transitions. */
export function Lightbox({ open, index, onClose, onChange }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const lastIndex = useRef(index);
  const total = galleryItems.length;
  const current = galleryItems[index];
  const stage = stageById(current.stageId);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      // RTL: left arrow = forward
      if (e.key === "ArrowLeft") onChange((index + 1) % total);
      if (e.key === "ArrowRight") onChange((index - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, total, onChange]);

  useGSAP(
    () => {
      if (!open || !frameRef.current) return;
      const dir = index >= lastIndex.current ? 1 : -1;
      lastIndex.current = index;
      if (prefersReducedMotion()) return;
      gsap.fromTo(frameRef.current, { opacity: 0, x: -40 * dir, scale: 0.98 }, { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: "expo.out", overwrite: true });
    },
    { dependencies: [index, open] },
  );

  return (
    <Modal open={open} onClose={onClose} label="عارض الصور" size="full">
      <div className="relative flex h-full flex-col bg-night/95">
        <div className="px-gutter flex h-[76px] shrink-0 items-center justify-between md:h-24">
          <p className="eyebrow tabular-nums" dir="ltr">
            {String(index + 1).padStart(2, "0")} <span className="text-blue-54">/ {String(total).padStart(2, "0")}</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center border border-cream/20 text-cream transition-colors hover:border-gold hover:text-gold"
            aria-label={ui.close}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="px-gutter flex min-h-0 flex-1 items-center justify-center">
          <div ref={frameRef} className="w-full" style={{ maxWidth: `min(92vw, calc(70vh * ${current.ratio}))` }}>
            <MediaFrame media={current.media} ratio={current.ratio} tone="blue" unitSize="lg" />
          </div>
        </div>

        <div className="px-gutter flex shrink-0 flex-col gap-6 pb-8 pt-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[0.95rem] text-cream">
              <Slot value={current.caption} className="text-cream" />
            </p>
            <p className="mt-1 text-[0.7rem] tracking-[0.1em] text-blue-54">
              {formatYear(current.year)}
              {stage && ` · ${stage.title}`}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChange((index - 1 + total) % total)}
              className="inline-flex h-11 w-11 items-center justify-center border border-cream/20 text-cream transition-colors hover:border-gold hover:text-gold"
              aria-label={ui.prev}
            >
              <ArrowBackIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onChange((index + 1) % total)}
              className="inline-flex h-11 w-11 items-center justify-center border border-gold text-gold transition-colors hover:bg-gold hover:text-night"
              aria-label={ui.next}
            >
              <ArrowIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
