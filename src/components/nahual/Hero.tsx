import heroAsset from "@/assets/hero.png.asset.json";
import { Button } from "./Button";

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-secondary pt-24 lg:pt-28">
      {/* Curva navy inferior derecha */}
      <svg
        className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[62%] lg:block"
        viewBox="0 0 800 600"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M800 0v600H150C520 545 430 210 800 0Z"
          className="fill-navy"
        />
        <path
          d="M800 0v600H150C520 545 430 210 800 0Z"
          className="fill-none stroke-primary/40"
          strokeWidth="3"
          transform="translate(-26 18)"
        />
      </svg>

      {/* Detalle de puntos */}
      <div
        className="pointer-events-none absolute left-4 top-[56%] hidden h-28 w-32 lg:block"
        style={{
          backgroundImage: "radial-gradient(var(--primary) 1.5px, transparent 1.5px)",
          backgroundSize: "18px 18px",
          opacity: 0.35,
        }}
      />
      <div
        className="pointer-events-none absolute right-6 top-24 hidden h-24 w-24 lg:block"
        style={{
          backgroundImage: "radial-gradient(var(--navy-foreground) 1.5px, transparent 1.5px)",
          backgroundSize: "18px 18px",
          opacity: 0.18,
        }}
      />
      <div className="pointer-events-none absolute -left-16 top-16 hidden h-56 w-56 rounded-full bg-primary/10 blur-3xl lg:block" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 lg:grid-cols-[1fr_1.1fr] lg:gap-4 lg:px-8 lg:pb-0">
        <div className="max-w-xl lg:pb-24">
          <p className="eyebrow">Nahual Auto</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] text-foreground sm:text-5xl lg:text-[3.4rem]">
            Cuidado profesional para tu vehículo<span className="text-primary">.</span>
          </h1>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-muted-foreground">
            Productos Nahual Auto diseñados para limpiar, proteger y mantener tu vehículo como
            nuevo.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#productos">
              <Button>Ver productos</Button>
            </a>
            <a href="#nosotros">
              <Button variant="outline">Conoce Nahual Auto</Button>
            </a>
          </div>
        </div>

        <div className="relative flex items-end justify-center lg:justify-end">
          <img
            src={heroAsset.url}
            alt="Botellas de shampoo automotriz Nahual Auto"
            width={1200}
            height={1200}
            className="w-full max-w-xl drop-shadow-2xl transition-transform duration-700 ease-out hover:-translate-y-2"
          />
        </div>
      </div>
    </section>
  );
}
