"use client";

import { useRef } from "react";
import { ui } from "@/data/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";
import { useUI } from "@/components/layout/Providers";
import { ArrowIcon } from "@/components/ui/Icons";

/**
 * Pulsing entry point to «السيرة المختصرة»: the full-screen chapter sequence
 * that ends on the question screen.
 */
export function StartStory({ className }: { className?: string }) {
  const { showIntro } = useUI();
  const ref = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // the words travel out of the circle
      gsap.fromTo(
        "[data-start-label]",
        { opacity: 0, x: 18, filter: "blur(4px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 1.2, delay: 0.9, ease: "expo.out" },
      );
    },
    { scope: ref },
  );

  return (
    <button
      ref={ref}
      type="button"
      onClick={showIntro}
      className={cn("group flex items-center gap-4 text-start", className)}
    >
      <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full border border-gold text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-night md:h-20 md:w-20">
        {/* the light the circle gives off, kept well outside the ring so it reads */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-gold)_70%,transparent),transparent_68%)] blur-2xl animate-erth-breathe"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-gold)_45%,transparent),transparent_72%)] blur-md"
        />
        <span aria-hidden="true" className="absolute inset-0 rounded-full border border-gold/70 animate-erth-ping" />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-gold/45 animate-erth-ping [animation-delay:1.15s]"
        />
        <ArrowIcon className="relative h-5 w-5 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1" />
      </span>
      <span data-start-label className="block">
        <span className="text-heading block text-[1.45rem] text-cream transition-colors duration-300 group-hover:text-gold md:text-[1.75rem]">
          {ui.startStory}
        </span>
        <span className="mt-1.5 block text-[0.85rem] tracking-[0.08em] text-blue-32">السيرة المختصرة في عشرة فصول</span>
      </span>
    </button>
  );
}
