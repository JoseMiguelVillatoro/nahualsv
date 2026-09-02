import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

    const entrega =
      data.entrega === "domicilio"
        ? `Envío a domicilio<br/>${esc(data.direccion)}<br/>${esc(data.municipio)}, ${esc(
            data.departamento,
          )}${data.referencia ? `<br/>Ref: ${esc(data.referencia)}` : ""}`
        : "Recoge el pedido en tienda";

    const rows = data.items
      .map(
        (i) =>
          `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${esc(i.name)}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${i.qty}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${money(
            i.price * i.qty,
          )}</td></tr>`,
      )
      .join("");

    const html = `<div style="font-family:Arial,sans-serif;color:#1B1E27;max-width:640px">
  <h2 style="color:#D2540F;margin:0 0 4px">Nuevo pedido ${esc(data.orderId)}</h2>
  <p style="margin:0 0 20px;color:#666">Pedido recibido desde el sitio web de Nahual Auto.</p>
  <h3 style="margin:20px 0 6px">Cliente</h3>
  <p style="margin:0;line-height:1.6">
    <strong>${esc(data.nombre)}</strong><br/>
    Correo: ${esc(data.email)}<br/>
    Teléfono / WhatsApp: ${esc(data.telefono)}
  </p>
  <h3 style="margin:20px 0 6px">Entrega</h3>
  <p style="margin:0;line-height:1.6">${entrega}</p>
  <h3 style="margin:20px 0 6px">Pago</h3>
  <p style="margin:0">${esc(PAGO_LABEL[data.pago] ?? data.pago)}</p>
  <h3 style="margin:20px 0 6px">Productos</h3>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <thead><tr><th style="text-align:left;padding-bottom:6px">Producto</th><th style="padding-bottom:6px">Cant.</th><th style="text-align:right;padding-bottom:6px">Total</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p style="margin:16px 0 0;line-height:1.8">
    Subtotal: ${money(data.subtotal)}<br/>
    Envío: ${data.envio > 0 ? money(data.envio) : "Gratis"}<br/>
    <strong style="font-size:16px">Total: ${money(data.total)}</strong>
  </p>
</div>`;

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

    const html = `<div style="font-family:Arial,sans-serif;color:#1B1E27;max-width:640px">
  <h2 style="color:#D2540F;margin:0 0 4px">Nuevo mensaje de contacto</h2>
  <p style="margin:0 0 20px;color:#666">Mensaje enviado desde el formulario de contacto de Nahual Auto.</p>
  <h3 style="margin:20px 0 6px">Cliente</h3>
  <p style="margin:0;line-height:1.6">
    <strong>${esc(data.name)}</strong><br/>
    Correo: ${esc(data.email)}<br/>
    Teléfono: ${esc(data.phone)}
  </p>
  <h3 style="margin:20px 0 6px">Asunto</h3>
  <p style="margin:0;line-height:1.6">${esc(data.subject)}</p>
  <h3 style="margin:20px 0 6px">Preferencia de contacto</h3>
  <p style="margin:0;line-height:1.6">${esc(CHANNEL_LABEL[data.channel] ?? data.channel)}</p>
  <h3 style="margin:20px 0 6px">Mensaje</h3>
  <p style="margin:0;line-height:1.6;white-space:pre-wrap">${esc(data.message)}</p>
</div>`;

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
