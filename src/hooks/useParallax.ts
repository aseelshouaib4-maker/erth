"use client";

import { useRef } from "react";
import { gsap, useGSAP, MEDIA } from "@/lib/gsap";

/**
 * Vertical parallax on `[data-parallax]` descendants (or the root itself).
 * `data-parallax="0.2"` moves the element 20% of the scrolled distance.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(defaultSpeed = 0.15) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-parallax]"));
      if (!targets.length) return;
      const mm = gsap.matchMedia();
      mm.add(`${MEDIA.motion} and ${MEDIA.desktop}`, () => {
        targets.forEach((el) => {
          const speed = parseFloat(el.dataset.parallax || "") || defaultSpeed;
          gsap.fromTo(
            el,
            { yPercent: -speed * 40 },
            {
              yPercent: speed * 40,
              ease: "none",
              scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
    },
    { scope: ref },
  );

  return ref;
}
