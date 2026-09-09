import { brand } from "@/data/site";
import { cn } from "@/lib/utils";

const WORDMARK_RATIO = 965 / 185;
const LOGO_RATIO = 1000 / 1033;

function maskStyle(url: string): React.CSSProperties {
  return {
    WebkitMaskImage: `url(${url})`,
    maskImage: `url(${url})`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  };
}

type MarkProps = {
  /** default height in px; override responsively with classes such as `md:h-[26px]` */
  height?: number;
  className?: string;
};

/**
 * «حفظ الإرث» wordmark (cut from the identity guide). Colour = currentColor.
 * Width follows the height through aspect-ratio, so a height class is all it needs.
 */
export function Wordmark({ height = 26, className }: MarkProps) {
  return (
    <span
      role="img"
      aria-label={brand.name}
      className={cn("inline-block h-[var(--mark-h)] shrink-0 bg-current", className)}
      style={{ ["--mark-h" as string]: `${height}px`, aspectRatio: `${WORDMARK_RATIO}`, ...maskStyle(brand.wordmark) }}
    />
  );
}

/** Arch ornament logo. Colour = currentColor. */
export function Logo({ height = 64, className }: MarkProps) {
  return (
    <span
      role="img"
      aria-label={`شعار ${brand.name}`}
      className={cn("inline-block h-[var(--mark-h)] shrink-0 bg-current", className)}
      style={{ ["--mark-h" as string]: `${height}px`, aspectRatio: `${LOGO_RATIO}`, ...maskStyle(brand.logoMask) }}
    />
  );
}
