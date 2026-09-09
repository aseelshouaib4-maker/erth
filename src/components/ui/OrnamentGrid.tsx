import { useId } from "react";
import { cn } from "@/lib/utils";
import { ORNAMENTS, type OrnamentUnit } from "./ornaments";

type Cell = { unit: OrnamentUnit; filled: boolean };

/** 4 × 4 rhythm reproduced from the identity guide tile («النظام كصورة»). */
const TILE: Cell[][] = [
  [
    { unit: "rose", filled: true },
    { unit: "star", filled: false },
    { unit: "rose", filled: true },
    { unit: "rose", filled: false },
  ],
  [
    { unit: "star", filled: false },
    { unit: "rose", filled: true },
    { unit: "rose", filled: false },
    { unit: "star", filled: true },
  ],
  [
    { unit: "rose", filled: true },
    { unit: "rose", filled: false },
    { unit: "star", filled: true },
    { unit: "rose", filled: false },
  ],
  [
    { unit: "rose", filled: false },
    { unit: "star", filled: true },
    { unit: "rose", filled: false },
    { unit: "rose", filled: true },
  ],
];

export type OrnamentScale = 1 | 2 | 4; // ثلاثة مقاييس فقط: 1× و2× و4×

type Props = {
  /** base cell size in px is 48 — scale multiplies it */
  scale?: OrnamentScale;
  /** filled units colour */
  filled?: string;
  /** outline units colour */
  outline?: string;
  /** overall opacity */
  opacity?: number;
  /** graded density: where the pattern fades out (toward the text) */
  fade?: "none" | "start" | "end" | "top" | "bottom" | "x" | "y" | "radial" | "edges";
  /** proportion of the cell that the unit occupies */
  fill?: number;
  className?: string;
};

const fades: Record<NonNullable<Props["fade"]>, string | undefined> = {
  none: undefined,
  start: "linear-gradient(to left, black 20%, transparent 85%)",
  end: "linear-gradient(to right, black 20%, transparent 85%)",
  top: "linear-gradient(to bottom, black 10%, transparent 80%)",
  bottom: "linear-gradient(to top, black 10%, transparent 80%)",
  x: "linear-gradient(to right, transparent, black 25%, black 75%, transparent)",
  y: "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
  radial: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
  edges: "radial-gradient(ellipse at center, transparent 35%, black 90%)",
};

/**
 * Repeating ornament field used as a ground for sections.
 * Absolutely positioned; parent must be `relative`.
 */
export function OrnamentGrid({
  scale = 1,
  filled = "var(--color-gold)",
  outline = "var(--color-blue-54)",
  opacity = 0.06,
  fade = "none",
  fill = 0.62,
  className,
}: Props) {
  const id = useId().replace(/:/g, "");
  const cell = 48 * scale;
  const size = cell * 4;
  const unit = cell * fill;
  const pad = (cell - unit) / 2;
  const mask = fades[fade];

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      aria-hidden="true"
      focusable="false"
      style={{
        opacity,
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    >
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          {TILE.map((row, r) =>
            row.map((c, k) => (
              <g key={`${r}-${k}`} transform={`translate(${k * cell + pad} ${r * cell + pad}) scale(${unit / 100})`}>
                <path
                  d={ORNAMENTS[c.unit]}
                  fill={c.filled ? filled : "none"}
                  stroke={c.filled ? "none" : outline}
                  strokeWidth={c.filled ? 0 : 1.5 / (unit / 100)}
                  fillRule="evenodd"
                />
              </g>
            )),
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
