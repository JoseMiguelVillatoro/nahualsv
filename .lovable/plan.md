# Proteger los archivos de imágenes de productos

## Situación

El bucket `product-images` es privado, pero no existe ninguna regla de acceso sobre los archivos guardados. El escáner de seguridad lo marca como error.

En la app, todo el acceso a esos archivos pasa por el servidor:

- La subida ocurre solo en el panel de administrador, con verificación de rol.
- La visualización pasa por una dirección interna del sitio que entrega la imagen desde el servidor.

Ambos caminos usan la llave privada del servidor, así que agregar reglas estrictas no rompe nada visible para los visitantes.

## Cambio propuesto

Una migración de base de datos que agregue reglas de acceso a los archivos, limitadas al bucket `product-images`:

- Ver archivos: solo cuentas con rol de administrador.
- Subir archivos: solo administradores.
- Modificar archivos: solo administradores.
- Borrar archivos: solo administradores.

Nadie sin sesión ni ninguna cuenta normal podrá leer ni tocar los archivos directamente; las imágenes del sitio público se seguirán viendo igual porque las entrega el servidor.

## Detalles técnicos

- `CREATE POLICY` en `storage.objects` para SELECT, INSERT, UPDATE y DELETE, con `bucket_id = 'product-images'` y `public.has_role(auth.uid(), 'admin')`, dirigidas al rol `authenticated`.
- No se modifica el bucket ni el código de la app.
- RLS ya está activo en `storage.objects` (gestionado por Supabase).

## Verificación

- Revisar que el panel de administrador siga subiendo imágenes correctamente.
- Revisar que las imágenes de productos sigan cargando en la página pública.
- Volver a correr el escáner de seguridad y marcar el hallazgo como resuelto.

## Nota aparte

El escáner también reporta una advertencia menor sobre funciones ejecutables por usuarios con sesión (`claim_first_admin`, `has_role`). Ambas son necesarias para el panel y están protegidas internamente; se puede revisar después si lo deseas.
