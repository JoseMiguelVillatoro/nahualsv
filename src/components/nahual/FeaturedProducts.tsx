import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Product } from "./products";
import { ProductCard } from "./ProductCard";

export function FeaturedProducts({ products }: { products: Product[] }) {
  const featured = products.filter((p) => p.featured);
  const loop = [...featured, ...featured];
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  const normalize = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    if (el.scrollLeft >= half) el.scrollLeft -= half;
    else if (el.scrollLeft < 0) el.scrollLeft += half;
  }, []);

  const scrollBy = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(320, el.clientWidth * 0.9), behavior: "smooth" });
  };

  // Movimiento continuo tipo marquee (se detiene al pasar el cursor).
  useEffect(() => {
    if (paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      const el = trackRef.current;
      if (el) {
        el.scrollLeft += (dt / 1000) * 40; // 40px por segundo
        normalize();
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused, normalize]);

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
              { Icon: ArrowLeft, dir: -1, label: "Anterior" },
              { Icon: ArrowRight, dir: 1, label: "Siguiente" },
            ].map(({ Icon, dir, label }) => (
              <button
                key={label}
                onClick={() => scrollBy(dir)}
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_12px_24px_-14px_color-mix(in_oklab,var(--primary)_85%,transparent)] focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 active:scale-95"
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        <div
          ref={trackRef}
          onScroll={normalize}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => {
            setPaused(false);
            setHovered(null);
          }}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          className="mt-10 flex gap-6 overflow-x-auto pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {loop.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
              onMouseEnter={() => setHovered(i)}
              onFocusCapture={() => setHovered(i)}
              className={`min-w-[88%] transition-all duration-500 ease-out sm:min-w-[58%] lg:min-w-[calc(50%-0.75rem)] xl:min-w-[calc(33.333%-1rem)] ${
                hovered === null
                  ? ""
                  : hovered === i
                    ? "z-10 scale-[1.03]"
                    : "scale-[0.98] opacity-55"
              }`}
            >
              <ProductCard product={p} className="h-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

