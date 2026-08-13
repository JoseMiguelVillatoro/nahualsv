import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="bg-background px-5 pb-20 lg:px-8 lg:pb-24">
      <div className="nahual-pattern-light relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center lg:py-20">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold text-primary-foreground sm:text-4xl">
          Tu vehículo merece el cuidado Nahual.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/85">
          Escríbenos y te ayudamos a elegir los productos ideales para tu vehículo o tu negocio.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#contacto"
            className="group inline-flex items-center gap-2 rounded-xl bg-navy px-7 py-3.5 text-sm font-semibold text-navy-foreground outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-deep hover:shadow-[0_18px_34px_-18px_rgba(0,0,0,0.7)] focus-visible:ring-2 focus-visible:ring-navy-foreground/60 active:scale-[0.97]"
          >
            Contáctanos
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#productos"
            className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/50 px-7 py-3.5 text-sm font-semibold text-primary-foreground outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-primary-foreground/60 active:scale-[0.97]"
          >
            Explorar productos
          </a>
        </div>
      </div>
    </section>
  );
}
