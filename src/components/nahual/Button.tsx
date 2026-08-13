import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghostLight";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold outline-none transition-[transform,box-shadow,background-color,color,border-color] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97]";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_8px_20px_-10px_color-mix(in_oklab,var(--primary)_70%,transparent)] hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_16px_30px_-12px_color-mix(in_oklab,var(--primary)_75%,transparent)]",
  outline:
    "border border-primary/70 text-primary hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_14px_28px_-16px_color-mix(in_oklab,var(--primary)_80%,transparent)]",
  ghostLight:
    "border border-navy-foreground/30 text-navy-foreground hover:-translate-y-0.5 hover:border-primary hover:text-primary",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: { variant?: Variant; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full" />
    </button>
  );
}
