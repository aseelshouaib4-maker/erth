import { cn } from "@/lib/utils";
import { isSlot, type MediaPlaceholder, type TextSlot } from "@/lib/placeholder";
import { Ornament } from "./Ornament";
import { type OrnamentUnit } from "./ornaments";
import { PlayIcon } from "./Icons";

/* ------------------------------------------------------------------
   Text placeholders — visibly slots, never real copy.
------------------------------------------------------------------ */

export function Slot({ value, className }: { value: TextSlot | string; className?: string }) {
  if (!isSlot(value)) return <span className={className}>{value}</span>;
  return (
    <span className={cn("ph-text", className)} title="نص بديل — يُستبدل بالمحتوى الفعلي">
      [{value.label}]
    </span>
  );
}

/** Long-form placeholder: slot label plus bars that indicate length. */
export function ParagraphSlot({ value, lines = 3, className }: { value: TextSlot; lines?: number; className?: string }) {
  const widths = ["100%", "92%", "76%", "88%", "60%"];
  return (
    <div className={cn("space-y-3", className)} aria-label={`نص بديل: ${value.label}`}>
      <Slot value={value} className="text-sm" />
      <div className="space-y-2.5" aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} className="block h-[3px] bg-blue-54/25" style={{ width: widths[i % widths.length] }} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Media placeholders
------------------------------------------------------------------ */

const kindLabel: Record<MediaPlaceholder["kind"], string> = {
  image: "صورة",
  video: "فيديو",
  audio: "صوت",
  document: "وثيقة",
};

const unitByKind: Record<MediaPlaceholder["kind"], OrnamentUnit> = {
  image: "rose",
  video: "star",
  audio: "rose",
  document: "rose",
};

type FrameProps = {
  media: MediaPlaceholder;
  /** width / height; omit when `fill` */
  ratio?: number;
  /** stretch to the parent (parent must be relative) */
  fill?: boolean;
  tone?: "blue" | "night" | "dark" | "mist" | "paper";
  /** ornament scale inside the frame */
  unitSize?: "sm" | "md" | "lg";
  showLabel?: boolean;
  /** enable hover treatment (scale + gold frame) */
  interactive?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const tones = {
  blue: "bg-blue text-blue-54",
  night: "bg-night text-blue-70",
  dark: "bg-blue-dark text-blue-70",
  mist: "bg-mist text-blue-54",
  paper: "bg-newsprint text-kraft",
};

const unitSizes = { sm: "w-10 md:w-12", md: "w-16 md:w-20", lg: "w-24 md:w-32" };

/**
 * A media slot rendered as a tile on the blue ground: fine grid, one ornament
 * unit, a small caption naming what belongs there. Video adds a play control.
 */
export function MediaFrame({
  media,
  ratio,
  fill,
  tone = "dark",
  unitSize = "md",
  showLabel = true,
  interactive,
  className,
  children,
}: FrameProps) {
  const aspect = ratio ?? media.ratio ?? 4 / 3;
  const unit = unitByKind[media.kind];
  return (
    <div
      className={cn(
        "group/frame overflow-hidden",
        tone === "paper" ? "bg-paper-grid" : "bg-blue-grid",
        tones[tone],
        fill ? "absolute inset-0" : "relative w-full",
        interactive && "cursor-pointer",
        className,
      )}
      style={fill ? undefined : { aspectRatio: `${aspect}` }}
      role="img"
      aria-label={`${kindLabel[media.kind]} بديلة: ${media.label}`}
    >
      {/* hairline frame */}
      <span className="pointer-events-none absolute inset-3 border border-current/35 transition-colors duration-500 group-hover/frame:border-gold/60" />

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-[var(--ease-out-expo)]",
          interactive && "group-hover/frame:scale-105",
        )}
      >
        {media.kind === "video" ? (
          <span className="relative flex items-center justify-center">
            <Ornament unit={unit} variant="outline" className={cn(unitSizes[unitSize], "opacity-40")} />
            <span className="absolute flex h-12 w-12 items-center justify-center rounded-full border border-gold/70 text-gold transition-all duration-500 group-hover/frame:scale-110 group-hover/frame:bg-gold group-hover/frame:text-night md:h-14 md:w-14">
              <PlayIcon className="h-5 w-5 -scale-x-100" />
            </span>
          </span>
        ) : media.kind === "audio" ? (
          <Waveform />
        ) : media.kind === "document" ? (
          <DocumentSheet />
        ) : (
          <Ornament unit={unit} variant="outline" className={cn(unitSizes[unitSize], "opacity-50")} />
        )}
      </div>

      {showLabel && (
        <span className="absolute bottom-4 start-4 end-4 flex items-end justify-between gap-3 text-[0.62rem] font-medium tracking-[0.1em] text-current/80">
          <span className="truncate">
            {kindLabel[media.kind]} · {media.label}
          </span>
          {media.kind === "video" && <span className="tabular-nums tracking-[0.22em]">00:00</span>}
        </span>
      )}
      {children}
    </div>
  );
}

function Waveform() {
  const bars = [8, 16, 26, 14, 34, 22, 40, 18, 30, 12, 36, 20, 28, 10, 24, 16, 32, 14, 22, 8];
  return (
    <span className="flex h-12 items-center gap-[3px]" aria-hidden="true">
      {bars.map((h, i) => (
        <span key={i} className="w-[2px] bg-current opacity-70" style={{ height: h }} />
      ))}
    </span>
  );
}

function DocumentSheet() {
  return (
    <span className="relative block h-[58%] w-[42%] border border-current/40 bg-cream/[0.04]" aria-hidden="true">
      <span className="absolute inset-x-[16%] top-[18%] space-y-[9%]">
        {[100, 84, 92, 60, 88].map((w, i) => (
          <span key={i} className="block h-[2px] bg-current/40" style={{ width: `${w}%` }} />
        ))}
      </span>
      <Ornament unit="star" variant="filled" className="absolute bottom-[10%] end-[12%] w-[18%] text-gold/70" />
    </span>
  );
}

/** Photograph tile: the real portrait sits as a printed tile on the blue ground. */
export function PortraitTile({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative overflow-hidden bg-mist", className)}>
      {children}
      <span className="pointer-events-none absolute inset-3 border border-night/10" />
    </div>
  );
}
