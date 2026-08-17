import { Link } from "@tanstack/react-router";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "./products";
import { QuantitySelector } from "./QuantitySelector";

export function CartButton() {
  const { count, open } = useCart();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Abrir carrito (${count} artículos)`}
      className="relative flex h-10 w-10 items-center justify-center rounded-lg text-foreground outline-none transition-all duration-300 hover:scale-105 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/60"
    >
      <ShoppingCart size={22} />
      {count > 0 && (
        <span
          key={count}
          className="animate-pop absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-bold text-primary-foreground"
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function CartDrawer() {
  const { items, isOpen, close, setQty, removeItem, clear, subtotal, count } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="animate-overlay absolute inset-0 bg-navy-deep/60 backdrop-blur-sm"
        onClick={close}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-label="Carrito de compras"
        className="animate-drawer absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="text-lg font-semibold text-foreground">Tu carrito ({count})</h2>
          <button
            onClick={close}
            aria-label="Cerrar carrito"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingCart size={36} className="text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">Tu carrito está vacío.</p>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item, i) => (
                <li
                  key={item.id}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className="animate-rise flex gap-4"
                >
                  <Link
                    to="/producto/$slug"
                    params={{ slug: item.slug }}
                    onClick={close}
                    className="shrink-0 overflow-hidden rounded-xl bg-secondary/70 p-2 transition-transform duration-300 hover:scale-105"
                  >
                    <img src={item.image} alt={item.name} className="h-20 w-16 object-contain" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {formatPrice(item.price)} c/u
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label={`Eliminar ${item.name}`}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <QuantitySelector
                        compact
                        value={item.qty}
                        min={1}
                        onChange={(v) => setQty(item.id, v)}
                      />
                      <span className="text-sm font-semibold text-foreground">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="border-t border-border px-6 py-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-lg font-semibold text-foreground">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            El envío se calcula en el checkout.
          </p>
          <div className="mt-5 space-y-3">
            {items.length > 0 && (
              <Link
                to="/checkout"
                onClick={close}
                className="block w-full rounded-xl bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark active:scale-[0.99]"
              >
                Ir al checkout
              </Link>
            )}
            <button
              onClick={close}
              className="w-full rounded-xl border border-primary/70 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Continuar comprando
            </button>
            {items.length > 0 && (
              <button
                onClick={clear}
                className="w-full rounded-xl px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
              >
                Vaciar carrito
              </button>
            )}
          </div>
        </footer>
      </aside>
    </div>
  );
}
