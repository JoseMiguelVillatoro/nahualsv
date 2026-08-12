import { Droplet, Gauge, MapPin, Users } from "lucide-react";

const items = [
  {
    icon: Droplet,
    title: "pH neutro",
    text: "Productos diseñados pensando en el cuidado adecuado de las superficies.",
  },
  {
    icon: Gauge,
    title: "Hasta 30 lavadas",
    text: "Rendimiento pensado para uso frecuente.",
  },
  {
    icon: Users,
    title: "Para entusiastas y profesionales",
    text: "Para quienes disfrutan cuidar su vehículo y para quienes trabajan en detailing.",
  },
  {
    icon: MapPin,
    title: "Hecho en El Salvador",
    text: "Orgullosamente desarrollado y producido en El Salvador.",
  },
];

export function WhyNahual() {
  return (
    <section className="nahual-pattern-light relative bg-navy py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.9fr_1.4fr] lg:px-8">
        <div>
          <p className="eyebrow">¿Por qué Nahual Auto?</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-navy-foreground sm:text-4xl">
            Productos diseñados para quienes aman su vehículo.
          </h2>
          <div className="mt-6 h-1 w-16 rounded-full bg-primary" />
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          {items.map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/60">
                <Icon size={20} className="text-primary" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-navy-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-foreground/65">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
