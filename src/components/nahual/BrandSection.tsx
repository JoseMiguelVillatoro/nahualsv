export function BrandSection() {
  return (
    <section id="nosotros" className="bg-background py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="eyebrow">Nahual Auto</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Más que limpieza. Es cuidado.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Desarrollamos productos para personas que consideran el cuidado del vehículo parte de su
            estilo de vida. Detailing hecho en El Salvador, con estándares profesionales.
          </p>
        </div>
        <div className="nahual-pattern relative overflow-hidden rounded-2xl bg-secondary p-10">
          <div className="grid grid-cols-2 gap-8">
            {[
              ["04", "Productos en catálogo"],
              ["30", "Lavadas por envase"],
              ["pH", "Fórmula neutra"],
              ["SV", "Hecho en El Salvador"],
            ].map(([k, v]) => (
              <div key={v}>
                <p className="font-display text-3xl font-bold text-primary">{k}</p>
                <p className="mt-1 text-sm text-muted-foreground">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
