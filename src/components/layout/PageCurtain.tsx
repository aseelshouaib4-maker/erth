"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Ornament } from "@/components/ui/Ornament";
import { CURTAIN_IN, CURTAIN_OUT, on } from "./transitions";

/** Night-blue curtain that wipes in before a route change and out after mount. */
export function PageCurtain() {
  const ref = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const mark = markRef.current;
    if (!el || !mark) return;
    let safety: number | undefined;

    const offIn = on(CURTAIN_IN, () => {
      gsap.killTweensOf([el, mark]);
      gsap.set(el, { display: "block", clipPath: "inset(100% 0 0 0)" });
      gsap
        .timeline()
        .to(el, { clipPath: "inset(0% 0 0 0)", duration: 0.55, ease: "power4.inOut" })
        .fromTo(mark, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }, "-=0.2");
      window.clearTimeout(safety);
      safety = window.setTimeout(() => window.dispatchEvent(new CustomEvent(CURTAIN_OUT)), 4000);
    });

    const offOut = on(CURTAIN_OUT, () => {
      window.clearTimeout(safety);
      if (getComputedStyle(el).display === "none") return;
      gsap.killTweensOf([el, mark]);
      gsap
        .timeline({ onComplete: () => gsap.set(el, { display: "none" }) })
        .to(mark, { opacity: 0, duration: 0.2 })
        .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.6, ease: "power4.inOut" }, "<");
    });

    return () => {
      offIn();
      offOut();
      window.clearTimeout(safety);
    };
  }, []);

  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-[85] hidden bg-night" aria-hidden="true">
      <div ref={markRef} className="absolute inset-0 flex items-center justify-center text-gold opacity-0">
        <Ornament unit="star" className="w-12" />
      </div>
    </div>
  );
}
