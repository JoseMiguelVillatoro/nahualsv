import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { OrderEmail } from "./email/order-email";
import { ContactEmail } from "./email/contact-email";
import { renderEmailTemplate } from "./email/render";

const itemSchema = z.object({
  name: z.string().trim().min(1).max(120),
  qty: z.number().int().min(1).max(999),
  price: z.number().min(0).max(100000),
});

const orderSchema = z.object({
  orderId: z.string().trim().min(1).max(40),
  nombre: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  telefono: z.string().trim().min(1).max(40),
  entrega: z.enum(["domicilio", "recoger"]),
  departamento: z.string().trim().max(120).optional().default(""),
  municipio: z.string().trim().max(120).optional().default(""),
  direccion: z.string().trim().max(400).optional().default(""),
  referencia: z.string().trim().max(400).optional().default(""),
  pago: z.enum(["transferencia", "contra-entrega", "en-linea"]),
  items: z.array(itemSchema).min(1).max(50),
  subtotal: z.number().min(0),
  envio: z.number().min(0),
  total: z.number().min(0),
});

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(1).max(20),
  subject: z.string().trim().min(1).max(150),
  channel: z.enum(["email", "phone", "whatsapp"]),
  message: z.string().trim().min(1).max(1000),
});

export type OrderPayload = z.input<typeof orderSchema>;
export type ContactPayload = z.input<typeof contactSchema>;

const money = (n: number) => `$${n.toFixed(2)}`;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const PAGO_LABEL: Record<string, string> = {
  transferencia: "Transferencia bancaria",
  "contra-entrega": "Pago contra entrega",
  "en-linea": "Pago en línea",
};

export const sendOrderEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env["LOVABLE_API_KEY"];
    const RESEND_API_KEY = process.env["RESEND_API_KEY"];
    const SALES_EMAIL = process.env["SALES_EMAIL"] ?? "mike.villatoro@hotmail.com";
    const FROM = process.env["ORDERS_FROM_EMAIL"] ?? "Nahual Auto <onboarding@resend.dev>";

    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      return { sent: false, error: "Email no configurado" as const };
    }

    const html = await renderEmailTemplate(
      OrderEmail({
        orderId: data.orderId,
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        entrega: data.entrega,
        departamento: data.departamento,
        municipio: data.municipio,
        direccion: data.direccion,
        referencia: data.referencia,
        pago: data.pago,
        items: data.items,
        subtotal: data.subtotal,
        envio: data.envio,
        total: data.total,
      }),
    );

    const response = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: FROM,
        to: [SALES_EMAIL],
        reply_to: data.email,
        subject: `Nuevo pedido ${data.orderId} — ${data.nombre} (${money(data.total)})`,
        html,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Resend request failed [${response.status}]: ${errorBody}`);
      return { sent: false, error: `No se pudo enviar el correo (${response.status})` };
    }

    return { sent: true as const };
  });

const CHANNEL_LABEL: Record<string, string> = {
  email: "Correo electrónico",
  phone: "Llamada telefónica",
  whatsapp: "WhatsApp",
};

export const sendContactEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env["LOVABLE_API_KEY"];
    const RESEND_API_KEY = process.env["RESEND_API_KEY"];
    const SALES_EMAIL = process.env["SALES_EMAIL"] ?? "mike.villatoro@hotmail.com";
    const FROM = process.env["ORDERS_FROM_EMAIL"] ?? "Nahual Auto <onboarding@resend.dev>";

    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      return { sent: false, error: "Email no configurado" as const };
    }

    const html = await renderEmailTemplate(
      ContactEmail({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        channel: data.channel,
        message: data.message,
      }),
    );

    const response = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: FROM,
        to: [SALES_EMAIL],
        reply_to: data.email,
        subject: `Contacto: ${data.subject} — ${data.name}`,
        html,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Resend request failed [${response.status}]: ${errorBody}`);
      return { sent: false, error: `No se pudo enviar el correo (${response.status})` };
    }

    return { sent: true as const };
  });
