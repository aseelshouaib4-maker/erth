"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MEDIA } from "@/lib/gsap";

type Options = {
  y?: number;
  stagger?: number;
  start?: string;
  duration?: number;
};

/**
 * Reveals every `[data-reveal]` descendant when it scrolls into view.
 * Elements start hidden via CSS (see globals.css) so there is no flash.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options: Options = {}) {
  const ref = useRef<T>(null);
  const { y = 28, stagger = 0.09, start = "top 88%", duration = 1.1 } = options;

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
      if (!targets.length) return;

      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        gsap.set(targets, { y });
        ScrollTrigger.batch(targets, {
          start,
          once: true,
          batchMax: 8,
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration, ease: "power3.out", stagger, overwrite: true }),
        });
      });
      mm.add(MEDIA.reduced, () => {
        gsap.set(targets, { opacity: 1, y: 0 });
      });
    },
    { scope: ref },
  );

  return ref;
}
