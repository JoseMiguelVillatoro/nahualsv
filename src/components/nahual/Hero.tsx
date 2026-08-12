import heroAsset from "@/assets/hero.png.asset.json";
import { Button } from "./Button";

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-secondary pt-28 lg:pt-32">
      <div className="pointer-events-none absolute -right-24 top-0 hidden h-[130%] w-[55%] rounded-l-[16rem] bg-navy lg:block" />
      <div className="nahual-pattern relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 lg:grid-cols-2 lg:gap-6 lg:px-8 lg:pb-24">
        <div className="max-w-xl">
          <p className="eyebrow">Nahual Auto</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
            Cuidado profesional para tu vehículo<span className="text-primary">.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
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

        <div className="relative flex justify-center lg:justify-end">
          <img
            src={heroAsset.url}
            alt="Botellas de shampoo automotriz Nahual Auto"
            width={1200}
            height={1200}
            className="w-full max-w-lg drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
