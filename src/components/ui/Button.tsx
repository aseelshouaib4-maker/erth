import { cn } from "@/lib/utils";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { ArrowIcon } from "./Icons";

type Variant = "outline" | "solid" | "ghost" | "link" | "paper" | "paper-solid";

type Common = {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
  /** يُمرَّر كما هو حين يفتح الزرّ قسمًا أو يصفه */
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "aria-label"?: string;
};

type AsLink = Common & { href: string; onClick?: React.MouseEventHandler<HTMLAnchorElement> };
type AsButton = Common & { href?: undefined; onClick?: React.MouseEventHandler<HTMLButtonElement>; type?: "button" | "submit" };

const variants: Record<Variant, string> = {
  outline: "border border-gold text-gold hover:bg-gold hover:text-night focus-visible:bg-gold focus-visible:text-night active:bg-gold active:text-night",
  solid: "bg-gold text-night border border-gold hover:bg-gold-soft",
  ghost: "border border-cream/30 text-cream hover:border-gold hover:bg-gold hover:text-night focus-visible:border-gold focus-visible:bg-gold focus-visible:text-night active:bg-gold active:text-night",
  link: "text-cream underline-offset-8 decoration-gold/60 hover:underline hover:text-gold px-0",
  /* on the archive paper ground */
  paper: "border border-blue text-blue hover:bg-blue hover:text-paper",
  "paper-solid": "border border-blue bg-blue text-paper hover:bg-blue-dark hover:border-blue-dark",
};

const sizes = {
  sm: "h-10 px-5 text-[0.75rem]",
  md: "h-12 px-7 text-[0.82rem]",
  lg: "h-14 px-9 text-[0.9rem]",
};

/** Sharp-cornered editorial button. The arrow points forward (left) in RTL. */
export function Button(props: AsLink | AsButton) {
  const { variant = "outline", size = "md", arrow, className, children } = props;
  const aria = {
    "aria-expanded": props["aria-expanded"],
    "aria-controls": props["aria-controls"],
    "aria-label": props["aria-label"],
  };
  const classes = cn(
    "group inline-flex items-center justify-center gap-3 font-body font-medium tracking-[0.1em] transition-colors duration-300",
    variant !== "link" && cn(sizes[size], "rounded-ui shadow-ui"),
    variants[variant],
    className,
  );
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <ArrowIcon className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1" />}
    </>
  );
  if ("href" in props && props.href) {
    return (
      <TransitionLink href={props.href} className={classes} onClick={props.onClick} {...aria}>
        {inner}
      </TransitionLink>
    );
  }
  const { onClick, type = "button" } = props as AsButton;
  return (
    <button type={type} className={classes} onClick={onClick} {...aria}>
      {inner}
    </button>
  );
}
