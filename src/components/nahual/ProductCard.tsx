import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import type { Product } from "./products";

export function ProductCard({ product: p, className = "" }: { product: Product; className?: string }) {
  return (
    <article
      className={`group flex gap-5 rounded-3xl border border-border/80 bg-card p-6 shadow-[0_1px_2px_rgba(16,18,26,0.04)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_24px_45px_-24px_rgba(16,18,26,0.35)] ${className}`}
    >
      <div className="relative shrink-0 self-start overflow-hidden rounded-2xl bg-secondary/70 p-3 transition-colors duration-300 group-hover:bg-secondary">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          width={700}
          height={900}
          className="h-40 w-24 object-contain transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>
      <div className="flex min-w-0 flex-col">
        <p className="eyebrow text-[0.65rem]">{p.category}</p>
        <h3 className="mt-2 text-lg font-semibold leading-tight text-foreground">{p.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.tagline}</p>
        {p.features.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {p.features.slice(0, 4).map((f) => (
              <li key={f} className="flex gap-2 text-xs text-muted-foreground">
                <Check size={13} className="mt-0.5 shrink-0 text-primary" />
                {f}
              </li>
            ))}
          </ul>
        )}
        <Link
          to="/producto/$slug"
          params={{ slug: p.slug }}
          className="mt-auto inline-flex items-center gap-1.5 self-start pt-6 text-sm font-semibold text-primary outline-none transition-colors hover:text-primary-dark focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          Ver producto
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
