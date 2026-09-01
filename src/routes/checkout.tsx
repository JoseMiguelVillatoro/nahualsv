import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, CreditCard, Landmark, ShoppingCart, Truck, Store } from "lucide-react";
import { Header } from "@/components/nahual/Header";
import { Footer } from "@/components/nahual/Footer";
import { formatPrice } from "@/components/nahual/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | Nahual Auto" },
      {
        name: "description",
        content:
          "Completa tu pedido de productos Nahual Auto: datos de entrega, método de envío y forma de pago.",
      },
      { property: "og:title", content: "Checkout | Nahual Auto" },
      {
        property: "og:description",
        content: "Finaliza tu compra de productos de limpieza y detailing automotriz Nahual Auto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const DELIVERY_FEE = 3.5;

type Delivery = "domicilio" | "recoger";
type Payment = "transferencia" | "contra-entrega" | "en-linea";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-ring/40";

function Field({
  label,
  name,
  type = "text",
  required = true,
  placeholder,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block text-sm font-medium text-foreground ${className}`}>
      {label}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const sendOrder = useServerFn(sendOrderEmail);
  const [delivery, setDelivery] = useState<Delivery>("domicilio");
  const [payment, setPayment] = useState<Payment>("transferencia");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [mailError, setMailError] = useState<string | null>(null);

  const shipping = delivery === "domicilio" && items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + shipping;
  const orderItems = useMemo(() => items, [items]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0 || sending) return;
    const fd = new FormData(e.currentTarget);
    const str = (k: string) => String(fd.get(k) ?? "").trim();
    const id = `NA-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

    setSending(true);
    setMailError(null);
    try {
      const res = await sendOrder({
        data: {
          orderId: id,
          nombre: str("nombre"),
          email: str("email"),
          telefono: str("telefono"),
          entrega: delivery,
          departamento: str("departamento"),
          municipio: str("municipio"),
          direccion: str("direccion"),
          referencia: str("referencia"),
          pago: payment,
          items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
          subtotal,
          envio: shipping,
          total,
        },
      });
      if (!res.sent) setMailError(res.error ?? "No se pudo enviar el correo");
    } catch {
      setMailError("No se pudo enviar el correo al equipo de ventas");
    }
    setSending(false);
    setOrderId(id);
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20 pt-28 lg:pt-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {orderId ? (
            <div className="animate-pop mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-[0_1px_2px_rgba(16,18,26,0.04)] sm:p-12">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check size={30} />
              </span>
              <h1 className="mt-6 text-3xl font-semibold text-foreground">¡Pedido recibido!</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Gracias por confiar en Nahual Auto. Te contactaremos por WhatsApp para coordinar la
                entrega y el pago.
              </p>
              <p className="mt-6 text-sm text-muted-foreground">Número de pedido</p>
              <p className="text-2xl font-semibold tracking-wide text-primary">{orderId}</p>
              <Link
                to="/"
                hash="productos"
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark"
              >
                Seguir comprando
              </Link>
            </div>
          ) : items.length === 0 ? (
            <div className="mx-auto max-w-xl py-16 text-center">
              <ShoppingCart size={40} className="mx-auto text-muted-foreground/50" />
              <h1 className="mt-6 text-2xl font-semibold text-foreground">Tu carrito está vacío</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Agrega productos para continuar con tu pedido.
              </p>
              <Link
                to="/"
                hash="productos"
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark"
              >
                Ver catálogo
              </Link>
            </div>
          ) : (
            <>
              <Link
                to="/"
                hash="productos"
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft size={16} /> Seguir comprando
              </Link>
              <h1 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">Checkout</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Completa tus datos para confirmar el pedido.
              </p>

              <form onSubmit={handleSubmit} className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
                <div className="space-y-8">
                  {/* Cliente */}
                  <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-foreground">Información del cliente</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <Field label="Nombre completo" name="nombre" className="sm:col-span-2" />
                      <Field label="Correo electrónico" name="email" type="email" />
                      <Field label="Teléfono / WhatsApp" name="telefono" type="tel" />
                    </div>
                  </section>

                  {/* Entrega */}
                  <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-foreground">Método de entrega</h2>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {(
                        [
                          { id: "domicilio", label: "Envío a domicilio", note: `+ ${formatPrice(DELIVERY_FEE)}`, icon: Truck },
                          { id: "recoger", label: "Recoger pedido", note: "Sin costo", icon: Store },
                        ] as const
                      ).map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => setDelivery(o.id)}
                          className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-300 ${
                            delivery === o.id
                              ? "border-primary bg-primary/5 shadow-[0_14px_28px_-24px_rgba(16,18,26,0.6)]"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          <o.icon size={18} className="text-primary" />
                          <span>
                            <span className="block text-sm font-semibold text-foreground">{o.label}</span>
                            <span className="text-xs text-muted-foreground">{o.note}</span>
                          </span>
                        </button>
                      ))}
                    </div>

                    {delivery === "domicilio" && (
                      <div className="animate-rise mt-6 grid gap-4 sm:grid-cols-2">
                        <Field label="Departamento" name="departamento" />
                        <Field label="Municipio" name="municipio" />
                        <Field label="Dirección" name="direccion" className="sm:col-span-2" />
                        <Field
                          label="Referencia"
                          name="referencia"
                          required={false}
                          placeholder="Punto de referencia (opcional)"
                          className="sm:col-span-2"
                        />
                      </div>
                    )}
                  </section>

                  {/* Pago */}
                  <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-foreground">Método de pago</h2>
                    <div className="mt-5 space-y-3">
                      {(
                        [
                          { id: "transferencia", label: "Transferencia bancaria", note: "Te enviamos los datos por WhatsApp", icon: Landmark, disabled: false },
                          { id: "contra-entrega", label: "Pago contra entrega", note: "Paga al recibir tu pedido", icon: Truck, disabled: false },
                          { id: "en-linea", label: "Pago en línea", note: "Próximamente", icon: CreditCard, disabled: true },
                        ] as const
                      ).map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          disabled={o.disabled}
                          onClick={() => setPayment(o.id)}
                          className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                            payment === o.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          <o.icon size={18} className="text-primary" />
                          <span>
                            <span className="block text-sm font-semibold text-foreground">{o.label}</span>
                            <span className="text-xs text-muted-foreground">{o.note}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Resumen */}
                <aside className="lg:sticky lg:top-28 lg:self-start">
                  <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-foreground">Resumen del pedido</h2>
                    <ul className="mt-5 space-y-4">
                      {orderItems.map((item) => (
                        <li key={item.id} className="flex gap-3">
                          <div className="shrink-0 rounded-xl bg-secondary/70 p-2">
                            <img src={item.image} alt={item.name} loading="lazy" decoding="async" className="h-14 w-11 object-contain" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.qty} × {formatPrice(item.price)}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {formatPrice(item.price * item.qty)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <dl className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Subtotal</dt>
                        <dd className="text-foreground">{formatPrice(subtotal)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Envío</dt>
                        <dd className="text-foreground">
                          {shipping > 0 ? formatPrice(shipping) : "Gratis"}
                        </dd>
                      </div>
                      <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                        <dt className="text-foreground">Total</dt>
                        <dd className="text-foreground">{formatPrice(total)}</dd>
                      </div>
                    </dl>

                    <button
                      type="submit"
                      className="mt-6 w-full rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark active:scale-[0.99]"
                    >
                      Confirmar pedido
                    </button>
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      Pagos en línea próximamente. Confirmamos tu pedido por WhatsApp.
                    </p>
                  </div>
                </aside>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
