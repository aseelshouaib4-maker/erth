import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  as?: "h1" | "h2" | "h3";
  size?: "md" | "lg" | "xl";
  /** use the display face (Lifta) instead of the heading face (Al Qabas) */
  display?: boolean;
  tone?: "cream" | "night";
  className?: string;
  id?: string;
  /** rendered after the description (links, buttons) */
  children?: React.ReactNode;
};

const sizes = {
  md: "text-[clamp(1.75rem,3.2vw,2.75rem)]",
  lg: "text-[clamp(2.25rem,4.6vw,4rem)]",
  xl: "text-[clamp(2.75rem,6.5vw,6rem)]",
};

/**
 * Eyebrow + title + short gold rule, as laid out in the identity guide pages.
 * Children get `data-reveal` so the parent `useReveal` container animates them.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "start",
  as: Tag = "h2",
  size = "lg",
  display,
  tone = "cream",
  className,
  id,
  children,
}: Props) {
  const center = align === "center";
  return (
    <div id={id} className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
      {eyebrow && (
        <p data-reveal className="eyebrow mb-4">
          {eyebrow}
        </p>
      )}
      <Tag
        data-reveal
        className={cn(
          display ? "text-display" : "text-heading",
          sizes[size],
          tone === "cream" ? "text-cream" : "text-night",
          "text-balance",
        )}
      >
        {title}
      </Tag>
      <span data-reveal className={cn("rule-gold mt-5", center && "mx-auto")} aria-hidden="true" />
      {description && (
        <p data-reveal className={cn("mt-6 max-w-xl text-[0.95rem] leading-[1.9]", tone === "cream" ? "text-blue-32" : "text-night/70", center && "mx-auto")}>
          {description}
        </p>
      )}
      {children && (
        <div data-reveal className={cn("mt-8 flex flex-wrap gap-4", center && "justify-center")}>
          {children}
        </div>
      )}
    </div>
  );
}
