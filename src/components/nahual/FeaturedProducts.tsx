import { useRef } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { products } from "./products";

export function FeaturedProducts() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section id="productos" className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Nuestros</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
              Productos destacados
            </h2>
            <div className="mt-4 h-1 w-20 rounded-full bg-primary" />
          </div>
          <div className="hidden gap-3 lg:flex">
            {[ArrowLeft, ArrowRight].map((Icon, i) => (
              <button
                key={i}
                onClick={() => scrollBy(i === 0 ? -1 : 1)}
                aria-label={i === 0 ? "Anterior" : "Siguiente"}
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
                  i === 1
                    ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:overflow-visible"
        >
          {products.map((p) => (
            <article
              key={p.id}
              className="group flex min-w-[85%] snap-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 sm:min-w-[60%] lg:min-w-0"
            >
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                width={700}
                height={900}
                className="h-40 w-28 shrink-0 self-start object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex min-w-0 flex-col">
                <h3 className="text-lg font-semibold leading-tight text-foreground">{p.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{p.category}</p>
                <p className="mt-4 text-sm leading-relaxed text-foreground/80">{p.tagline}</p>
                <ul className="mt-4 space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2 text-xs text-muted-foreground">
                      <Check size={13} className="mt-0.5 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="mt-6 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary">
                  Ver producto
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
