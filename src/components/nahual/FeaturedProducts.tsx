import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { products } from "./products";

export function FeaturedProducts() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scrollBy = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(320, el.clientWidth * 0.9), behavior: "smooth" });
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
          <div className="flex gap-3">
            {[
              { Icon: ArrowLeft, dir: -1, disabled: atStart, label: "Anterior" },
              { Icon: ArrowRight, dir: 1, disabled: atEnd, label: "Siguiente" },
            ].map(({ Icon, dir, disabled, label }) => (
              <button
                key={label}
                onClick={() => scrollBy(dir)}
                disabled={disabled}
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_12px_24px_-14px_color-mix(in_oklab,var(--primary)_85%,transparent)] focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-35"
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        <div
          ref={trackRef}
          onScroll={update}
          className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((p) => (
            <article
              key={p.id}
              className="group flex min-w-[88%] snap-start gap-5 rounded-3xl border border-border/80 bg-card p-6 shadow-[0_1px_2px_rgba(16,18,26,0.04)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_24px_45px_-24px_rgba(16,18,26,0.35)] sm:min-w-[58%] lg:min-w-[calc(50%-0.75rem)] xl:min-w-[calc(33.333%-1rem)]"
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
                <h3 className="mt-2 text-lg font-semibold leading-tight text-foreground">
                  {p.name}
                </h3>
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
                <button className="mt-auto inline-flex items-center gap-1.5 self-start pt-6 text-sm font-semibold text-primary outline-none transition-colors hover:text-primary-dark focus-visible:ring-2 focus-visible:ring-ring/60">
                  Ver producto
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
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
