"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { brand, nav, ui } from "@/data/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";
import { OrnamentGrid } from "@/components/ui/OrnamentGrid";
import { CloseIcon, SearchIcon } from "@/components/ui/Icons";
import { Wordmark } from "@/components/ui/Brand";
import { Ornament } from "@/components/ui/Ornament";
import { useUI } from "./Providers";
import { TransitionLink } from "./TransitionLink";

type Props = { open: boolean; onClose: () => void };

export function MenuOverlay({ open, onClose }: Props) {
  const pathname = usePathname();
  const { openSearch, openAssistant } = useUI();
  // stays mounted while the exit animation plays; adjusted during render (no effect needed)
  const [rendered, setRendered] = useState(open);
  if (open && !rendered) setRendered(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!rendered || !root) return;
      const reduced = prefersReducedMotion();
      const links = root.querySelectorAll("[data-menu-link]");
      const extras = root.querySelectorAll("[data-menu-extra]");
      if (open) {
        gsap
          .timeline()
          .fromTo(root, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: reduced ? 0 : 0.8, ease: "power4.inOut" })
          .fromTo(links, { y: reduced ? 0 : 40, opacity: 0 }, { y: 0, opacity: 1, duration: reduced ? 0 : 0.9, stagger: 0.06, ease: "expo.out" }, "-=0.25")
          .fromTo(extras, { opacity: 0 }, { opacity: 1, duration: reduced ? 0 : 0.6 }, "-=0.5");
      } else {
        gsap
          .timeline({ onComplete: () => setRendered(false) })
          .to([links, extras], { opacity: 0, duration: reduced ? 0 : 0.25 })
          .to(root, { clipPath: "inset(0 0 100% 0)", duration: reduced ? 0 : 0.6, ease: "power4.inOut" }, "<");
      }
    },
    { dependencies: [open, rendered], scope: rootRef },
  );

  if (!rendered) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[80] flex flex-col bg-night text-cream" role="dialog" aria-modal="true" aria-label={ui.menu}>
      <OrnamentGrid scale={2} fade="edges" opacity={0.08} outline="var(--color-blue-70)" />
      <div className="px-gutter relative flex h-[76px] items-center justify-between md:h-24">
        <Wordmark height={24} className="text-cream" />
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 w-11 items-center justify-center border border-cream/20 text-cream transition-colors hover:border-gold hover:text-gold"
          aria-label={ui.close}
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      <nav className="px-gutter relative flex flex-1 flex-col justify-center py-8" aria-label={ui.menu}>
        <ul className="space-y-1 md:space-y-2">
          {nav.map((item, i) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href} data-menu-link className="flex items-baseline gap-5 border-b border-cream/10 py-3 md:py-4">
                <span className="eyebrow w-8 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <TransitionLink
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "text-heading text-[clamp(2rem,7vw,4.5rem)] leading-none transition-colors duration-300",
                    active ? "text-gold" : "text-cream hover:text-gold",
                  )}
                >
                  {item.label}
                </TransitionLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div data-menu-extra className="px-gutter relative flex flex-wrap items-center justify-between gap-4 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              openAssistant();
            }}
            className="inline-flex h-12 items-center gap-3 border border-gold px-5 text-[0.8rem] font-medium tracking-[0.1em] text-gold transition-colors hover:bg-gold hover:text-night"
          >
            <Ornament unit="star" className="w-3.5" />
            {ui.assistantTitle}
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              openSearch();
            }}
            className="inline-flex h-12 items-center gap-3 border border-cream/20 px-5 text-[0.8rem] tracking-[0.1em] text-cream/85 transition-colors hover:border-cream hover:text-cream"
          >
            <SearchIcon className="h-4 w-4" />
            {ui.searchTitle}
          </button>
        </div>
        <p className="eyebrow tracking-sep">{brand.tagline}</p>
      </div>
    </div>
  );
}
