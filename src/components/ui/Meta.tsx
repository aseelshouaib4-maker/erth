import { cn } from "@/lib/utils";

/**
 * Small label row that keeps Arabic words and numeric ranges from colliding
 * in bidi layout: each numeric item is isolated with dir="ltr".
 */
export function Meta({
  items,
  className,
  tone = "gold",
}: {
  items: Array<string | number | undefined | null | false>;
  className?: string;
  tone?: "gold" | "muted";
}) {
  const visible = items.filter((i): i is string | number => i !== undefined && i !== null && i !== false && i !== "");
  return (
    <p className={cn("eyebrow flex flex-wrap items-center gap-x-3 gap-y-1", tone === "muted" && "text-blue-54", className)}>
      {visible.map((item, i) => {
        const numeric = /^[\d\s\-–—/.:]+$/.test(String(item));
        return (
          <span key={i} dir={numeric ? "ltr" : undefined} className={cn(i > 0 && "border-s border-current/30 ps-3", numeric && "tabular-nums")}>
            {item}
          </span>
        );
      })}
    </p>
  );
}
