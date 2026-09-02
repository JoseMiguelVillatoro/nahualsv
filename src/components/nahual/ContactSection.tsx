import { useState } from "react";
import { Loader2, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "./Button";
import { sendContactEmail } from "@/lib/orders.functions";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty({ message: "Ingresa tu nombre" })
    .max(100, { message: "Máximo 100 caracteres" }),
  email: z
    .string()
    .trim()
    .email({ message: "Correo electrónico inválido" })
    .max(255, { message: "Máximo 255 caracteres" }),
  phone: z
    .string()
    .trim()
    .nonempty({ message: "Ingresa tu teléfono" })
    .max(20, { message: "Máximo 20 caracteres" })
    .regex(/^[0-9+()\-\s]*$/, { message: "Solo números y signos +, -, ( )" }),
  subject: z
    .string()
    .trim()
    .nonempty({ message: "Ingresa un asunto" })
    .max(150, { message: "Máximo 150 caracteres" }),
  channel: z.enum(["email", "phone", "whatsapp"]),
  message: z
    .string()
    .trim()
    .nonempty({ message: "Escribe tu mensaje" })
    .max(1000, { message: "Máximo 1000 caracteres" }),
});

type Field = keyof z.infer<typeof contactSchema>;

const initial = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  channel: "email" as "email" | "phone" | "whatsapp",
  message: "",
};

const inputClass =
  "w-full rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground/70 focus:border-primary focus:bg-background focus:ring-2 focus:ring-ring/25";

const labelClass = "mb-2 block text-xs font-semibold text-foreground";

const channels = [
  { id: "email" as const, Icon: Mail, label: "Correo electrónico" },
  { id: "phone" as const, Icon: Phone, label: "Llamada telefónica" },
  { id: "whatsapp" as const, Icon: MessageCircle, label: "WhatsApp" },
];

const contactInfo = [
  { Icon: Phone, label: "+503 0000 0000" },
  { Icon: Mail, label: "hola@nahualauto.com" },
  { Icon: MapPin, label: "San Salvador, El Salvador" },
];

export function ContactSection() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sending, setSending] = useState(false);

  const setField = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Revisa los campos marcados");
      return;
    }

    setSending(true);
    // Demo sin backend: la conexión con Resend se hará más adelante.
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    setValues(initial);
    toast.success("¡Mensaje enviado! (demo)", {
      description: `Gracias ${parsed.data.name}, te contactaremos pronto.`,
    });
  };

  return (
    <section id="contacto" className="relative overflow-hidden bg-navy px-5 py-20 lg:px-8 lg:py-28">
      <div
        className="pointer-events-none absolute right-8 top-10 hidden h-28 w-32 lg:block"
        style={{
          backgroundImage: "radial-gradient(var(--primary) 1.5px, transparent 1.5px)",
          backgroundSize: "18px 18px",
          opacity: 0.4,
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <div>
          <p className="eyebrow">Contacto</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-navy-foreground sm:text-4xl">
            Hablemos del cuidado de tu vehículo
            <span className="text-primary">.</span>
          </h2>
          <div className="mt-4 h-1 w-20 rounded-full bg-primary" />
          <p className="mt-6 max-w-md text-base leading-relaxed text-navy-foreground/70">
            Cuéntanos qué necesitas: distribución, mayoreo o recomendaciones de producto. Te
            respondemos en menos de 24 horas.
          </p>

          <ul className="mt-10 space-y-4">
            {contactInfo.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-navy-foreground/80">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-foreground/20 text-primary transition-colors duration-300 hover:border-primary">
                  <Icon size={17} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="rounded-3xl border border-navy-foreground/10 bg-background p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:p-8"
        >
          <h3 className="text-xl font-bold text-foreground sm:text-2xl">Envíanos un Mensaje</h3>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelClass}>
                Nombre completo <span className="text-primary">*</span>
              </label>
              <input
                id="name"
                value={values.name}
                maxLength={100}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Tu nombre"
                className={inputClass}
              />
              {errors.name && <p className="mt-1.5 text-xs text-destructive">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Correo electrónico <span className="text-primary">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={values.email}
                maxLength={255}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="tu@email.com"
                className={inputClass}
              />
              {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>
                Teléfono <span className="text-primary">*</span>
              </label>
              <input
                id="phone"
                value={values.phone}
                maxLength={20}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="+503 0000-0000"
                className={inputClass}
              />
              {errors.phone && <p className="mt-1.5 text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="subject" className={labelClass}>
                Asunto <span className="text-primary">*</span>
              </label>
              <input
                id="subject"
                value={values.subject}
                maxLength={150}
                onChange={(e) => setField("subject", e.target.value)}
                placeholder="¿En qué podemos ayudarte?"
                className={inputClass}
              />
              {errors.subject && <p className="mt-1.5 text-xs text-destructive">{errors.subject}</p>}
            </div>
          </div>

          <div className="mt-5">
            <p className={labelClass}>
              ¿Cómo prefieres ser contactado? <span className="text-primary">*</span>
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {channels.map(({ id, Icon, label }) => {
                const active = values.channel === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setField("channel", id)}
                    aria-pressed={active}
                    className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-xs font-medium transition-all duration-200 ${
                      active
                        ? "border-primary bg-primary/10 text-primary shadow-[0_10px_24px_-16px_color-mix(in_oklab,var(--primary)_80%,transparent)]"
                        : "border-border bg-secondary/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="message" className={labelClass}>
              Mensaje <span className="text-primary">*</span>
            </label>
            <textarea
              id="message"
              rows={5}
              value={values.message}
              maxLength={1000}
              onChange={(e) => setField("message", e.target.value)}
              placeholder="Describe tu consulta o solicitud de cotización..."
              className={`${inputClass} resize-none`}
            />
            <div className="mt-1.5 flex items-center justify-between">
              <p className="text-xs text-destructive">{errors.message ?? ""}</p>
              <p className="text-xs text-muted-foreground">{values.message.length}/1000</p>
            </div>
          </div>

          <Button type="submit" disabled={sending} className="mt-6 w-full">
            {sending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send size={16} />
                Enviar Mensaje
              </>
            )}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {"\n"}
          </p>
        </form>
      </div>
    </section>
  );
}
