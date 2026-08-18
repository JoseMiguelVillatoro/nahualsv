import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { products } from "./products";
import { ProductCard } from "./ProductCard";


export function FeaturedProducts() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [paused, setPaused] = useState(false);

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

  // Autoplay: avanza solo y vuelve al inicio al llegar al final.
  useEffect(() => {
    if (paused) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      if (end) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: Math.max(320, el.clientWidth * 0.9), behavior: "smooth" });
    }, 3500);
    return () => window.clearInterval(id);
  }, [paused]);


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
            <ProductCard
              key={p.id}
              product={p}
              className="min-w-[88%] snap-start sm:min-w-[58%] lg:min-w-[calc(50%-0.75rem)] xl:min-w-[calc(33.333%-1rem)]"
            />
          ))}
        </div>

      </div>
    </section>
  );
}
