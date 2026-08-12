import { ArrowRight, Check } from "lucide-react";
import { products } from "./products";

export function FeaturedProducts() {
  return (
    <section id="productos" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="eyebrow">Nuestros</p>
        <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
          Productos destacados
        </h2>
        <div className="mt-4 h-1 w-16 rounded-full bg-primary" />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <article
              key={p.id}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="mb-5 flex h-52 items-center justify-center rounded-xl bg-secondary">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={700}
                  height={900}
                  className="h-44 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-semibold leading-tight text-foreground">{p.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{p.category}</p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/80">{p.tagline}</p>
              <ul className="mt-4 space-y-1.5">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-xs text-muted-foreground">
                    <Check size={14} className="mt-0.5 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="mt-6 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary">
                Ver producto
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
