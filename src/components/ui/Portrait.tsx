"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/components/content/SiteContent";

type Props = {
  /** `tile` keeps the photograph as printed; `duotone` multiplies it into the blue ground */
  variant?: "tile" | "duotone";
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** inner wrapper hook for GSAP scale animations */
  innerProps?: React.HTMLAttributes<HTMLDivElement>;
};

/** The character portrait, as set on «الشخصية» in the admin. */
export function Portrait({ variant = "tile", className, priority, sizes = "(min-width: 768px) 40vw, 80vw", innerProps }: Props) {
  const { person } = useSiteContent();
  const { portrait } = person;
  return (
    <div className={cn("relative overflow-hidden", variant === "tile" ? "bg-mist" : "bg-blue", className)}>
      <div {...innerProps} className={cn("absolute inset-0", innerProps?.className)}>
        <Image
          src={portrait.src}
          alt={portrait.alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", variant === "duotone" && "img-tile")}
          style={{ objectPosition: portrait.focus ?? "center 62%" }}
        />
      </div>
      <span className={cn("pointer-events-none absolute inset-3 border", variant === "tile" ? "border-night/10" : "border-cream/10")} />
    </div>
  );
}
