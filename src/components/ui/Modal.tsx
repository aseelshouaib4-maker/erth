"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  label: string;
  size?: "panel" | "full";
  className?: string;
  children: React.ReactNode;
};

/** Portal modal with GSAP enter/exit, scroll lock, ESC and focus restore. */
export function Modal({ open, onClose, label, size = "panel", className, children }: Props) {
  // stays mounted while the exit animation plays; adjusted during render (no effect needed)
  const [rendered, setRendered] = useState(open);
  if (open && !rendered) setRendered(true);

  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.();
    };
  }, [open, onClose]);

  useGSAP(
    () => {
      const panel = panelRef.current;
      const backdrop = backdropRef.current;
      if (!rendered || !panel || !backdrop) return;
      const reduced = prefersReducedMotion();
      if (open) {
        gsap
          .timeline()
          .fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: reduced ? 0 : 0.5, ease: "power2.out" })
          .fromTo(
            panel,
            { opacity: 0, y: reduced ? 0 : 36, scale: reduced ? 1 : 0.985 },
            { opacity: 1, y: 0, scale: 1, duration: reduced ? 0 : 0.85, ease: "expo.out" },
            "<0.08",
          )
          .add(() => panel.focus({ preventScroll: true }));
      } else {
        gsap
          .timeline({ onComplete: () => setRendered(false) })
          .to(panel, { opacity: 0, y: reduced ? 0 : 20, duration: reduced ? 0 : 0.3, ease: "power2.in" })
          .to(backdrop, { opacity: 0, duration: reduced ? 0 : 0.3 }, "<0.05");
      }
    },
    { dependencies: [open, rendered] },
  );

  if (!rendered || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label={label}>
      <div ref={backdropRef} className="absolute inset-0 bg-night/85 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex",
          size === "full" ? "items-stretch" : "items-end justify-center md:items-center md:p-6",
        )}
      >
        <div
          ref={panelRef}
          tabIndex={-1}
          className={cn(
            "pointer-events-auto outline-none",
            size === "full" ? "flex-1" : "w-full md:w-[min(960px,94vw)]",
            className,
          )}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
