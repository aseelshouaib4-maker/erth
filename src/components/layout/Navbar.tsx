"use client";

import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { nav, paperRoutes, ui } from "@/data/site";
import { gsap, ScrollTrigger, useGSAP, MEDIA } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/ui/Brand";
import { MenuIcon, SearchIcon } from "@/components/ui/Icons";
import { Ornament } from "@/components/ui/Ornament";
import { useUI } from "./Providers";
import { TransitionLink } from "./TransitionLink";
import { MenuOverlay } from "./MenuOverlay";

export function Navbar() {
  const pathname = usePathname();
  const { openSearch, openAssistant } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  /* over the paper ground the bar wears gold and darkens on hover; once the
     visitor scrolls the bar gets its own night background and goes back to cream */
  const onPaper = paperRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const paper = onPaper && !scrolled;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      ScrollTrigger.create({
        start: "top -60",
        end: "max",
        onToggle: (self) => setScrolled(self.isActive),
      });
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        let hidden = false;
        ScrollTrigger.create({
          start: "top -240",
          end: "max",
          onUpdate: (self) => {
            const shouldHide = self.direction === 1 && self.isActive;
            if (shouldHide !== hidden) {
              hidden = shouldHide;
              gsap.to(el, { yPercent: hidden ? -100 : 0, duration: 0.6, ease: "power3.out", overwrite: true });
            }
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <>
      <header
        ref={ref}
        className={cn(
          "fixed inset-x-0 top-0 z-[70] transition-[background-color,border-color,height] duration-500",
          scrolled ? "border-b border-cream/10 bg-night/85 backdrop-blur-md" : "border-b border-transparent bg-transparent",
        )}
      >
        <div
          className={cn(
            "px-gutter flex items-center justify-between gap-4 transition-[height] duration-500",
            scrolled ? "h-16 md:h-[72px]" : "h-[76px] md:h-24",
          )}
        >
          <TransitionLink
            href="/"
            className={cn("transition-colors", paper ? "text-gold hover:text-ink" : "text-cream hover:text-gold")}
            aria-label="الرئيسية"
          >
            <Wordmark height={22} className="md:h-[26px]" />
          </TransitionLink>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="التنقّل الرئيسي">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  title={item.note}
                  className={cn(
                    "group relative py-2 font-body text-[0.8rem] font-medium tracking-[0.1em] transition-colors",
                    paper
                      ? active
                        ? "text-ink"
                        : "text-gold hover:text-ink"
                      : active
                        ? "text-gold"
                        : "text-cream/80 hover:text-cream",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute inset-x-0 -bottom-0.5 h-px origin-right transition-transform duration-500 ease-out-expo",
                      paper ? "bg-ink" : "bg-gold",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </TransitionLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={openSearch}
              aria-label={ui.searchTitle}
              title={ui.searchTitle}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center border transition-colors md:h-11 md:w-11",
                paper ? "border-gold text-gold hover:border-ink hover:text-ink" : "border-cream/25 text-cream hover:border-gold hover:text-gold",
              )}
            >
              <SearchIcon className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => openAssistant()}
              className={cn(
                "group hidden h-11 items-center gap-2.5 border px-4 text-[0.75rem] font-medium tracking-[0.08em] transition-colors md:inline-flex",
                paper
                  ? "border-gold text-gold hover:border-ink hover:bg-ink hover:text-paper"
                  : "border-gold/70 text-gold hover:bg-gold hover:text-night",
              )}
            >
              <Ornament unit="star" className="w-3.5" />
              {ui.assistantTitle}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center border transition-colors lg:hidden md:h-11 md:w-11",
                paper ? "border-gold text-gold hover:border-ink hover:text-ink" : "border-cream/20 text-cream hover:border-cream",
              )}
              aria-label={ui.menu}
              aria-expanded={menuOpen}
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
