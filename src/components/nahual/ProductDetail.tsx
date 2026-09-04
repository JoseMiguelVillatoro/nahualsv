import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronRight, ShieldCheck, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice, type Product } from "./products";
import { ProductGallery } from "./ProductGallery";
import { QuantitySelector } from "./QuantitySelector";

export function ProductDetail({ product }: { product: Product }) {
  const { addItem, open } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setQty(1);
    setAdded(false);
  }, [product.slug]);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2500);
    return () => clearTimeout(t);
  }, [added]);

  const handleAdd = () => {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        size: product.size,
      },
      qty,
    );
    setAdded(true);
    open();
  };

  return (
    <div className="bg-background pb-20 pt-28 lg:pt-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <nav aria-label="Ruta" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-primary">
            Inicio
          </Link>
          <ChevronRight size={14} />
          <Link to="/" hash="productos" className="transition-colors hover:text-primary">
            Productos
          </Link>
          <ChevronRight size={14} />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={product.images} alt={product.name} />

          <div>
            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary">
              {product.category}
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">{product.name}</h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">{product.description}</p>

            {product.features.length > 0 && (
              <div className="mt-7 border-t border-border pt-7">
                <h2 className="text-base font-semibold text-foreground">Características principales</h2>
                <ul className="mt-4 space-y-2.5">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-border pt-7">
              <span className="text-3xl font-semibold text-foreground">{formatPrice(product.price)}</span>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                {product.size}
              </span>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-foreground">Cantidad</p>
              <div className="mt-2">
                <QuantitySelector value={qty} onChange={setQty} />
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="group/btn mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_-14px_color-mix(in_oklab,var(--primary)_80%,transparent)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark focus-visible:ring-2 focus-visible:ring-ring/60 active:scale-[0.99] sm:w-auto sm:min-w-[320px]"
            >
              <ShoppingCart size={18} />
              Agregar al carrito
            </button>

            <div aria-live="polite" className="mt-4 min-h-6">
              {added && (
                <p className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                  <Check size={15} /> Producto agregado al carrito
                </p>
              )}
            </div>

            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck size={16} className="text-primary" /> Coordinamos pago y entrega contigo
            </p>


            <Link
              to="/"
              hash="productos"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              <ArrowLeft size={16} /> Regresar al catálogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
