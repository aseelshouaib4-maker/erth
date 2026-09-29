"use client";

import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";
import { OrnamentGrid } from "./OrnamentGrid";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  /** «blue» is the site's ground; «paper» is the warm white from the guide */
  tone?: "blue" | "paper";
  /**
   * The gold rule under the title. Turn it off where the eyebrow above the
   * title already marks it — one accent per heading, never two.
   */
  rule?: boolean;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Opening band of inner pages: the title centred on the ground, with a graded
 * ornament field behind it. No section numeral and no ornament in the margin —
 * the heading stands on its own.
 */
export function PageHeader({ eyebrow, title, description, tone = "blue", rule = true, className, children }: Props) {
  const ref = useReveal<HTMLDivElement>();
  const paper = tone === "paper";

  return (
    <section
      ref={ref}
      className={cn("relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-44", paper ? "bg-paper" : "bg-blue", className)}
    >
      <OrnamentGrid
        scale={2}
        fade="edges"
        opacity={paper ? 0.14 : 0.08}
        outline={paper ? "var(--color-kraft)" : undefined}
      />
      <div className="px-gutter relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <p data-reveal className="eyebrow mb-5">
          {eyebrow}
        </p>
        <h1
          data-reveal
          className={cn("text-display text-[clamp(2.75rem,7vw,6.5rem)] text-balance", paper ? "text-blue" : "text-cream")}
        >
          {title}
        </h1>
        {rule && <span data-reveal className="rule-gold mt-6" aria-hidden="true" />}
        {description && (
          <p
            data-reveal
            className={cn("mt-6 max-w-xl text-[0.95rem] leading-[1.9]", paper ? "text-ink/70" : "text-blue-32")}
          >
            {description}
          </p>
        )}
        {children && (
          <div data-reveal className="mt-8">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
