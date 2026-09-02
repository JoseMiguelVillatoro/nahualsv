# Mejorar las plantillas de correo de pedidos y contacto

## Contexto actual

Los correos de pedidos y contacto se generan hoy como cadenas HTML inline dentro de `src/lib/orders.functions.ts`. Eso funciona, pero es difícil de mantener, no es responsive de forma nativa para clientes de correo y no aprovecha la identidad visual de Nahual Auto.

## Objetivo

Reemplazar los HTML strings por plantillas React Email profesionales, manteniendo Resend como proveedor de envío a través del gateway de Lovable.

## Propuesta

1. Instalar React Email en el proyecto (`@react-email/components` y el renderizador).
2. Crear una carpeta `src/lib/email/` con:
   - `order-email.tsx`: plantilla para nuevos pedidos, con logo, datos del cliente, tabla de productos, totales y método de pago/entrega.
   - `contact-email.tsx`: plantilla para mensajes del formulario de contacto.
   - `render.ts`: helper para renderizar una plantilla a HTML string antes de enviarlo por Resend.
3. Refactorizar `src/lib/orders.functions.ts` para que `sendOrderEmail` y `sendContactEmail` usen las plantillas React Email en lugar de HTML inline.
4. Asegurar que el `from`, `reply_to`, `to` y `subject` se mantengan igual, y que Resend siga recibiendo un string `html` válido.
5. Verificar el build y hacer una prueba de envío de cada flujo (pedido y contacto).

## Nota sobre dónde viven las plantillas

Las plantillas quedarán en el código del proyecto, no en el dashboard de Resend. Esto permite versionarlas, mantener la marca consistente y previsualizarlas localmente. Resend solo se usa para la entrega real del correo.

## Alcance fuera de este plan

- No cambiamos de proveedor (se mantiene Resend).
- No agregamos nuevos campos al formulario de contacto ni al checkout.
- No configuramos dominio de envío adicional; se reutiliza el remitente actual.
