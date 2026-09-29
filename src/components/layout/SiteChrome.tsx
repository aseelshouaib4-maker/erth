"use client";

import { usePathname } from "next/navigation";

/**
 * The site furniture — navbar, footer, search, assistant, intro.
 *
 * Standalone routes opt out entirely. The wedding invitation is a self-
 * contained piece with its own language, direction and palette; the archive's
 * navigation on top of it would read as a mistake.
 */
const STANDALONE = ["/wedding"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const standalone = STANDALONE.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (standalone) return null;
  return <>{children}</>;
}
