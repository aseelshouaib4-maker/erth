import Image from "next/image";
import { person } from "@/data/person";
import { cn } from "@/lib/utils";

type Props = {
  /** `tile` keeps the photograph as printed; `duotone` multiplies it into the blue ground */
  variant?: "tile" | "duotone";
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** inner wrapper hook for GSAP scale animations */
  innerProps?: React.HTMLAttributes<HTMLDivElement>;
};

/** The only real photograph in the project: the character portrait. */
export function Portrait({ variant = "tile", className, priority, sizes = "(min-width: 768px) 40vw, 80vw", innerProps }: Props) {
  return (
    <div className={cn("relative overflow-hidden", variant === "tile" ? "bg-[#e5e5e5]" : "bg-blue", className)}>
      <div {...innerProps} className={cn("absolute inset-0", innerProps?.className)}>
        <Image
          src={person.portrait.src}
          alt={person.portrait.alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover object-[center_62%]", variant === "duotone" && "img-tile")}
        />
      </div>
      <span className={cn("pointer-events-none absolute inset-3 border", variant === "tile" ? "border-night/10" : "border-cream/10")} />
    </div>
  );
}
