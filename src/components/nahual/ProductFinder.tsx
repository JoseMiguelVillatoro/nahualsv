import { useState } from "react";
import { products } from "./products";

const needs = [
  { id: "regular", label: "Quiero limpieza regular", product: "shampoo-con-cera" },
  { id: "intensa", label: "Tengo suciedad intensa", product: "shampoo-sin-cera" },
  { id: "brillo", label: "Quiero brillo", product: "shampoo-con-cera" },
  { id: "interior", label: "Quiero cuidar el interior", product: "silicon-interiores" },
];

export function ProductFinder() {
  const [active, setActive] = useState(needs[0].id);
  const selected = needs.find((n) => n.id === active)!;
  const product = products.find((p) => p.id === selected.product)!;

  return (
    <section className="bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="eyebrow">Asesor Nahual</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-foreground sm:text-4xl">
          Encuentra el producto adecuado para tu vehículo
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {needs.map((n) => (
              <button
                key={n.id}
                onClick={() => setActive(n.id)}
                className={`rounded-xl border p-5 text-left text-sm font-medium transition-all duration-200 ${
                  active === n.id
                    ? "border-primary bg-card text-foreground shadow-sm"
                    : "border-border bg-card/60 text-muted-foreground hover:border-primary/40"
                }`}
              >
                <span
                  className={`mb-3 block h-1.5 w-8 rounded-full ${
                    active === n.id ? "bg-primary" : "bg-border"
                  }`}
                />
                {n.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 rounded-2xl border border-border bg-card p-6">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              width={700}
              height={900}
              className="h-40 w-auto object-contain"
            />
            <div>
              <p className="eyebrow">Recomendado</p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">{product.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{product.tagline}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
