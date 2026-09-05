import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { rowToProduct, type Product } from "@/components/nahual/products";

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

/** Catálogo público (solo productos visibles). */
export const listProducts = createServerFn({ method: "GET" }).handler(async (): Promise<Product[]> => {
  const { data, error } = await publicClient()
    .from("products")
    .select("*")
    .eq("visible", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("listProducts", error.message);
    return [];
  }
  return (data ?? []).map(rowToProduct);
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }): Promise<Product | null> => {
    const { data: row, error } = await publicClient()
      .from("products")
      .select("*")
      .eq("visible", true)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) {
      console.error("getProductBySlug", error.message);
      return null;
    }
    return row ? rowToProduct(row) : null;
  });

/* ----------------------------- Admin ----------------------------- */

async function assertAdmin(ctx: { supabase: ReturnType<typeof publicClient>; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
  if (error || !data) throw new Error("Forbidden");
}

export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    return { isAdmin: Boolean(data) };
  });

export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("claim_first_admin");
    if (error) throw new Error(error.message);
    return { claimed: Boolean(data) };
  });

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Product[]> => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToProduct);
  });

const productInput = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  name: z.string().trim().min(1).max(120),
  category: z.string().trim().max(120).default(""),
  tagline: z.string().trim().max(200).default(""),
  description: z.string().trim().max(2000).default(""),
  benefit: z.string().trim().max(200).default(""),
  features: z.array(z.string().trim().min(1).max(120)).max(20).default([]),
  price: z.number().min(0).max(100000),
  size: z.string().trim().max(60).default(""),
  available: z.boolean().default(true),
  visible: z.boolean().default(true),
  featured: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(10000).default(0),
  areas: z.array(z.enum(["exterior", "interior", "ambos"])).default([]),
  needs: z.array(z.enum(["limpieza", "brillo", "proteccion", "mantenimiento"])).default([]),
  results: z
    .array(z.enum(["limpieza-profunda", "acabado-premium", "proteccion", "mantenimiento-diario"]))
    .default([]),
  images: z.array(z.string().trim().min(1).max(1000)).max(10).default([]),
});
export type ProductInput = z.input<typeof productInput>;

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => productInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const row = {
      slug: data.slug,
      name: data.name,
      category: data.category,
      tagline: data.tagline,
      description: data.description,
      benefit: data.benefit,
      features: data.features,
      price: data.price,
      size: data.size,
      available: data.available,
      visible: data.visible,
      featured: data.featured,
      sort_order: data.sortOrder,
      areas: data.areas,
      needs: data.needs,
      results: data.results,
      images: data.images,
    };
    const q = data.id
      ? context.supabase.from("products").update(row).eq("id", data.id).select("id").single()
      : context.supabase.from("products").insert(row).select("id").single();
    const { data: saved, error } = await q;
    if (error) {
      if (error.code === "23505") throw new Error("Ya existe un producto con ese slug");
      throw new Error(error.message);
    }
    return { id: saved.id };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Sube una imagen (base64) al almacenamiento y devuelve su URL pública en el sitio. */
export const uploadProductImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
        base64: z.string().min(1).max(5_500_000),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const bytes = Buffer.from(data.base64, "base64");
    if (bytes.byteLength > 4 * 1024 * 1024) throw new Error("La imagen supera 4 MB");
    const ext = IMAGE_TYPES[data.contentType]!;
    const path = `${crypto.randomUUID()}.${ext}`;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage
      .from("product-images")
      .upload(path, bytes, { contentType: data.contentType, upsert: false });
    if (error) throw new Error(error.message);
    return { url: `/api/public/img/${path}` };
  });

/* --------------------------- Pedidos / mensajes --------------------------- */

export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({ id: z.string().uuid(), status: z.enum(["nuevo", "contactado", "pagado", "entregado", "cancelado"]) })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("orders").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateMessageStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["nuevo", "atendido"]) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("contact_messages")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
