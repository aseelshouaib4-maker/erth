import { cn } from "@/lib/utils";
import { ORNAMENTS, type OrnamentUnit } from "./ornaments";

type Props = {
  unit?: OrnamentUnit;
  variant?: "filled" | "outline";
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
};

/**
 * One ornament unit. Colour comes from `currentColor`, size from the className.
 * Rule from the guide: units are never rotated.
 */
export function Ornament({ unit = "rose", variant = "filled", className, strokeWidth = 1.25, style }: Props) {
  return (
    <svg viewBox="0 0 100 100" className={cn("block", className)} style={style} aria-hidden="true" focusable="false">
      <path
        d={ORNAMENTS[unit]}
        fill={variant === "filled" ? "currentColor" : "none"}
        stroke={variant === "outline" ? "currentColor" : "none"}
        strokeWidth={strokeWidth}
        fillRule="evenodd"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
}
