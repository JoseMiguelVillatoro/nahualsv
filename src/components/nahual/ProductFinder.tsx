import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, RotateCcw, ShoppingCart, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart";
import {
  formatPrice,
  recommendProduct,
  type Area,
  type Need,
  type Result,
  type Product,
} from "./products";
import { Reveal } from "./Reveal";

const steps = [
  {
    key: "area" as const,
    question: "¿Qué quieres cuidar?",
    options: [
      { value: "exterior", label: "Exterior" },
      { value: "interior", label: "Interior" },
      { value: "ambos", label: "Ambos" },
    ],
  },
  {
    key: "need" as const,
    question: "¿Qué necesita tu vehículo?",
    options: [
      { value: "limpieza", label: "Limpieza" },
      { value: "brillo", label: "Brillo" },
      { value: "proteccion", label: "Protección" },
      { value: "mantenimiento", label: "Mantenimiento" },
    ],
  },
  {
    key: "result" as const,
    question: "¿Qué resultado buscas?",
    options: [
      { value: "limpieza-profunda", label: "Limpieza profunda" },
      { value: "acabado-premium", label: "Acabado premium" },
      { value: "proteccion", label: "Protección" },
      { value: "mantenimiento-diario", label: "Mantenimiento diario" },
    ],
  },
];

type Answers = { area?: Area; need?: Need; result?: Result };

export function ProductFinder({ products }: { products: Product[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const { addItem, open } = useCart();

  const done = step >= steps.length;
  const product =
    done && answers.area && answers.need && answers.result
      ? recommendProduct(products, answers.area, answers.need, answers.result)
      : null;

  const select = (key: keyof Answers, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
  };

  const current = steps[Math.min(step, steps.length - 1)]!;

  return (
    <section id="asesor" className="bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <p className="eyebrow inline-flex items-center gap-2">
            <Sparkles size={14} /> Asesor Nahual
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-foreground sm:text-4xl">
            Encuentra el producto adecuado
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Cuéntanos qué necesita tu vehículo y Nahual te recomienda por dónde empezar.
          </p>
        </Reveal>

        <Reveal delay={80} className="mt-10">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(16,18,26,0.04)] sm:p-8 lg:p-10">
            {/* Progreso */}
            <div className="flex items-center gap-3">
              {steps.map((s, i) => (
                <div key={s.key} className="flex flex-1 items-center gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                      done || step > i
                        ? "bg-primary text-primary-foreground"
                        : step === i
                          ? "bg-primary/15 text-primary ring-2 ring-primary/40"
                          : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {done || step > i ? <Check size={14} /> : i + 1}
                  </span>
                  <span
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                      done || step > i ? "bg-primary" : "bg-border"
                    }`}
                  />
                </div>
              ))}
            </div>

            {!done ? (
              <div key={current.key} className="animate-rise mt-8">
                <p className="text-sm font-medium text-muted-foreground">
                  Paso {step + 1} de {steps.length}
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-foreground">{current.question}</h3>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {current.options.map((o, i) => (
                    <button
                      key={o.value}
                      onClick={() => select(current.key, o.value)}
                      style={{ animationDelay: `${i * 50}ms` }}
                      className="animate-rise group rounded-2xl border border-border bg-card p-5 text-left text-sm font-semibold text-foreground outline-none transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_18px_32px_-22px_rgba(16,18,26,0.5)] focus-visible:ring-2 focus-visible:ring-ring/60"
                    >
                      <span className="mb-3 block h-1.5 w-8 rounded-full bg-border transition-all duration-300 group-hover:w-12 group-hover:bg-primary" />
                      {o.label}
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
                  >
                    <ArrowLeft size={15} /> Atrás
                  </button>
                )}
              </div>
            ) : (
              product && (
                <div className="animate-pop mt-8 grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
                  <div className="mx-auto overflow-hidden rounded-2xl bg-secondary/70 p-5">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="h-44 w-auto object-contain transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div>
                    <p className="eyebrow">Recomendado para ti</p>
                    <h3 className="mt-2 text-2xl font-semibold text-foreground">{product.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{product.benefit}</p>
                    <p className="mt-4 text-2xl font-semibold text-foreground">
                      {formatPrice(product.price)}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        to="/producto/$slug"
                        params={{ slug: product.slug }}
                        className="inline-flex items-center justify-center rounded-xl border border-primary/70 px-5 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
                      >
                        Ver producto
                      </Link>
                      <button
                        onClick={() => {
                          addItem({
                            id: product.id,
                            slug: product.slug,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            size: product.size,
                          });
                          open();
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark active:scale-[0.98]"
                      >
                        <ShoppingCart size={16} /> Agregar al carrito
                      </button>
                      <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
                      >
                        <RotateCcw size={15} /> Empezar de nuevo
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
