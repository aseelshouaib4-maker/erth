"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { hasSeenIntro } from "@/lib/utils";
import { useUI } from "@/components/layout/Providers";
import { IntroOverlay } from "./IntroOverlay";

/**
 * Shows the first-visit story over the homepage. Re-mounting the overlay
 * (replay from the footer) restarts the sequence from the title card.
 */
export function IntroStory() {
  const pathname = usePathname();
  const { introVisible, showIntro } = useUI();

  useLayoutEffect(() => {
    if (pathname === "/" && !hasSeenIntro()) showIntro();
    // runs once on first mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!introVisible) return null;
  return <IntroOverlay />;
}
