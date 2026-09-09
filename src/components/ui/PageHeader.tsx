"use client";

import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";
import { OrnamentGrid } from "./OrnamentGrid";
import { Ornament } from "./Ornament";
import type { OrnamentUnit } from "./ornaments";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  index?: string;
  unit?: OrnamentUnit;
  /** «blue» is the site's ground; «paper» is the archive paper from the guide */
  tone?: "blue" | "paper";
  /**
   * The gold rule under the title. Turn it off where the eyebrow above the
   * title already marks it — one accent per heading, never two.
   */
  rule?: boolean;
  className?: string;
  children?: React.ReactNode;
};

/** Opening band of inner pages: title on the ground with a graded ornament field. */
export function PageHeader({
  eyebrow,
  title,
  description,
  index,
  unit = "star",
  tone = "blue",
  rule = true,
  className,
  children,
}: Props) {
  const ref = useReveal<HTMLDivElement>();
  const paper = tone === "paper";

  return (
    <section
      ref={ref}
      className={cn("relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-44", paper ? "bg-paper" : "bg-blue", className)}
    >
      <OrnamentGrid
        scale={2}
        fade="start"
        opacity={paper ? 0.14 : 0.08}
        filled={paper ? "var(--color-kraft)" : undefined}
        outline={paper ? "var(--color-kraft)" : undefined}
      />
      <div className="px-gutter relative grid gap-10 md:grid-cols-12 md:items-stretch">
        <div className="md:col-span-8">
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

        {/* الجانب المقابل: رقم القسم ووحدة زخرفيّة كبيرة، حتى لا يبقى الفراغ صامتًا */}
        <div className="hidden md:col-span-4 md:flex md:flex-col md:items-end md:justify-between md:gap-10">
          {index && (
            <span
              data-reveal
              className={cn("text-display text-[6rem] leading-none", paper ? "text-ink/10" : "text-cream/10")}
            >
              {index}
            </span>
          )}
          <div data-reveal className="flex items-center gap-6">
            <span
              aria-hidden="true"
              className={cn("hidden h-px w-24 lg:block", paper ? "bg-ink/15" : "bg-cream/15")}
            />
            <Ornament unit={unit} className="w-20 text-gold lg:w-24" />
          </div>
        </div>
      </div>
    </section>
  );
}
