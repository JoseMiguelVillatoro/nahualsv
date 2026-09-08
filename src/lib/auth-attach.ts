import { createMiddleware } from "@tanstack/react-start";

/**
 * Adjunta el token de sesión a las llamadas al servidor.
 * A diferencia del adjuntador generado, nunca lanza error: si el cliente de
 * autenticación no está disponible (por ejemplo, variables de entorno ausentes
 * en un despliegue), la llamada continúa sin token en lugar de romper todas las
 * páginas públicas.
 */
export const attachAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
  let token: string | undefined;
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data } = await supabase.auth.getSession();
    token = data.session?.access_token;
  } catch (error) {
    console.warn("[auth] No se pudo obtener la sesión:", error);
  }
  return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
});
