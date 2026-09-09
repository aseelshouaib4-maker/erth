"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/** Recalculates ScrollTrigger positions once fonts and images have settled. */
export function ScrollRefresher() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);
  return null;
}
