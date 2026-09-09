"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { forwardRef } from "react";
import { prefersReducedMotion } from "@/lib/utils";
import { CURTAIN_IN, emit } from "./transitions";

type Props = React.ComponentPropsWithoutRef<typeof Link> & { href: string };

const CURTAIN_DURATION = 520;

/**
 * Next.js Link with the site's navigation rules:
 *
 * - a link to another route plays the curtain, then pushes; the router lands at
 *   the top of the destination;
 * - a link to the page you are already on never adds a history entry — it
 *   glides back to the top, or to the section its hash names;
 * - browser back and forward are untouched, so Next restores the scroll
 *   position the visitor left behind.
 */
export const TransitionLink = forwardRef<HTMLAnchorElement, Props>(function TransitionLink(
  { href, onClick, children, ...rest },
  ref,
) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    const modified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
    const external = /^https?:/.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
    if (modified || external) return;

    const [path, hash] = href.split("#");
    const smooth = prefersReducedMotion() ? "auto" : "smooth";

    if (path === "" || path === pathname) {
      e.preventDefault();
      if (hash) {
        const target = document.getElementById(hash);
        if (target) {
          target.scrollIntoView({ behavior: smooth, block: "start" });
          window.history.replaceState(window.history.state, "", `#${hash}`);
        }
      } else {
        window.scrollTo({ top: 0, behavior: smooth });
      }
      return;
    }

    // reduced motion skips the curtain and lets the router do its normal thing
    if (prefersReducedMotion()) return;

    e.preventDefault();
    emit(CURTAIN_IN);
    window.setTimeout(() => router.push(href), CURTAIN_DURATION);
  };

  return (
    <Link ref={ref} href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
});
