"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import { CURTAIN_OUT, emit } from "@/components/layout/transitions";

/** Page enter animation; re-mounts on every navigation. */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        // transforms are cleared so pinned sections inside never have a transformed ancestor
        clearProps: "all",
        onComplete: () => ScrollTrigger.refresh(),
      },
    );
  }, []);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => emit(CURTAIN_OUT));
    return () => window.cancelAnimationFrame(id);
  }, []);

  return <div ref={ref}>{children}</div>;
}
