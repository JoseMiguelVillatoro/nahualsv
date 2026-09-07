import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { Logo } from "@/components/nahual/Logo";
import {
  getAdminStatus,
  claimFirstAdmin,
  adminListProducts,
  saveProduct,
  deleteProduct,
  uploadProductImage,
  adminListOrders,
  updateOrderStatus,
  adminListMessages,
  updateMessageStatus,
} from "@/lib/catalog.functions";
import {
  AREA_OPTIONS,
  NEED_OPTIONS,
  RESULT_OPTIONS,
  formatPrice,
  type Area,
  type Need,
  type Product,
  type Result,
} from "@/components/nahual/products";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel de administración | Nahual Auto" },
      { name: "description", content: "Gestiona productos, pedidos y mensajes de Nahual Auto." },
      { property: "og:title", content: "Panel de administración | Nahual Auto" },
      { property: "og:description", content: "Panel interno de Nahual Auto." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const ORDER_STATUSES = ["nuevo", "contactado", "pagado", "entregado", "cancelado"] as const;

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchStatus = useServerFn(getAdminStatus);
  const claim = useServerFn(claimFirstAdmin);

  const status = useQuery({ queryKey: ["admin-status"], queryFn: () => fetchStatus() });

  const claimMutation = useMutation({
    mutationFn: () => claim(),
    onSuccess: (res) => {
      if (res.claimed) {
        toast.success("Ya eres administrador");
        queryClient.invalidateQueries({ queryKey: ["admin-status"] });
      } else {
        toast.error("Ya existe un administrador", {
          description: "Pide acceso a la persona que administra el sitio.",
        });
      }
    },
    onError: () => toast.error("No pudimos activar el acceso"),
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">Panel interno</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10">
        {status.isLoading ? (
          <p className="text-muted-foreground">Cargando…</p>
        ) : status.data?.isAdmin ? (
          <Tabs defaultValue="productos">
            <TabsList>
              <TabsTrigger value="productos">Productos</TabsTrigger>
              <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
              <TabsTrigger value="mensajes">Mensajes</TabsTrigger>
            </TabsList>
            <TabsContent value="productos" className="mt-6">
              <ProductsPanel />
            </TabsContent>
            <TabsContent value="pedidos" className="mt-6">
              <OrdersPanel />
            </TabsContent>
            <TabsContent value="mensajes" className="mt-6">
              <MessagesPanel />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
            <h1 className="text-xl font-semibold text-foreground">Aún no tienes acceso</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Si eres la primera persona del equipo, activa aquí tu acceso de administrador.
            </p>
            <Button className="mt-5" onClick={() => claimMutation.mutate()} disabled={claimMutation.isPending}>
              {claimMutation.isPending ? "Activando…" : "Activar mi acceso"}
            </Button>
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
}

/* ------------------------------ Productos ------------------------------ */

type Draft = {
  id?: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  benefit: string;
  features: string;
  price: string;
  size: string;
  available: boolean;
  visible: boolean;
  featured: boolean;
  sortOrder: string;
  areas: Area[];
  needs: Need[];
  results: Result[];
  images: string[];
};

const emptyDraft: Draft = {
  slug: "",
  name: "",
  category: "",
  tagline: "",
  description: "",
  benefit: "",
  features: "",
  price: "0",
  size: "",
  available: true,
  visible: true,
  featured: true,
  sortOrder: "0",
  areas: [],
  needs: [],
  results: [],
  images: [],
};

function toDraft(p: Product): Draft {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    tagline: p.tagline,
    description: p.description,
    benefit: p.benefit,
    features: p.features.join("\n"),
    price: String(p.price),
    size: p.size,
    available: p.available,
    visible: p.visible,
    featured: p.featured,
    sortOrder: String(p.sortOrder),
    areas: p.attributes.areas,
    needs: p.attributes.needs,
    results: p.attributes.results,
    images: p.images,
  };
}

function ProductsPanel() {
  const queryClient = useQueryClient();
  const list = useServerFn(adminListProducts);
  const save = useServerFn(saveProduct);
  const remove = useServerFn(deleteProduct);

  const [draft, setDraft] = useState<Draft | null>(null);

  const products = useQuery({ queryKey: ["admin-products"], queryFn: () => list() });

  const saveMutation = useMutation({
    mutationFn: (d: Draft) =>
      save({
        data: {
          ...(d.id ? { id: d.id } : {}),
          slug: d.slug.trim(),
          name: d.name.trim(),
          category: d.category.trim(),
          tagline: d.tagline.trim(),
          description: d.description.trim(),
          benefit: d.benefit.trim(),
          features: d.features
            .split("\n")
            .map((f) => f.trim())
            .filter(Boolean),
          price: Number(d.price) || 0,
          size: d.size.trim(),
          available: d.available,
          visible: d.visible,
          featured: d.featured,
          sortOrder: Number(d.sortOrder) || 0,
          areas: d.areas,
          needs: d.needs,
          results: d.results,
          images: d.images,
        },
      }),
    onSuccess: () => {
      toast.success("Producto guardado");
      setDraft(null);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (e) => toast.error("No se pudo guardar", { description: e instanceof Error ? e.message : undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Producto eliminado");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: () => toast.error("No se pudo eliminar"),
  });

  if (draft) {
    return (
      <ProductForm
        draft={draft}
        onChange={setDraft}
        onCancel={() => setDraft(null)}
        onSave={() => saveMutation.mutate(draft)}
        saving={saveMutation.isPending}
      />
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Productos</h2>
        <Button onClick={() => setDraft(emptyDraft)}>Nuevo producto</Button>
      </div>
      {products.isLoading ? (
        <p className="text-muted-foreground">Cargando productos…</p>
      ) : (
        <div className="grid gap-3">
          {(products.data ?? []).map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                ) : null}
              </div>
              <div className="min-w-[180px] flex-1">
                <p className="font-medium text-foreground">{p.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(p.price)} · /{p.slug}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {!p.visible && <Badge variant="secondary">Oculto</Badge>}
                {!p.available && <Badge variant="secondary">Agotado</Badge>}
                {p.featured && <Badge>Destacado</Badge>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setDraft(toDraft(p))}>
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm(`¿Eliminar "${p.name}"?`)) deleteMutation.mutate(p.id);
                  }}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
          {(products.data ?? []).length === 0 && (
            <p className="text-muted-foreground">Todavía no hay productos.</p>
          )}
        </div>
      )}
    </div>
  );
}

function Chips<T extends string>({
  options,
  values,
  onToggle,
}: {
  options: { value: T; label: string }[];
  values: T[];
  onToggle: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = values.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onToggle(o.value)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function ProductForm({
  draft,
  onChange,
  onCancel,
  onSave,
  saving,
}: {
  draft: Draft;
  onChange: (d: Draft) => void;
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  const upload = useServerFn(uploadProductImage);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    onChange({ ...draft, [key]: value });
  }

  function toggle<T extends string>(key: "areas" | "needs" | "results", value: T) {
    const current = draft[key] as unknown as T[];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onChange({ ...draft, [key]: next } as Draft);
  }

  async function handleFile(file: File) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Formato no admitido", { description: "Usa JPG, PNG o WebP." });
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error("La imagen supera 4 MB");
      return;
    }
    setUploading(true);
    try {
      const buffer = await file.arrayBuffer();
      let binary = "";
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.length; i += 8192) {
        binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
      }
      const base64 = btoa(binary);
      const res = await upload({
        data: { contentType: file.type as "image/jpeg" | "image/png" | "image/webp", base64 },
      });
      onChange({ ...draft, images: [...draft.images, res.url] });
      toast.success("Imagen subida");
    } catch (e) {
      toast.error("No se pudo subir la imagen", { description: e instanceof Error ? e.message : undefined });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="space-y-6 rounded-2xl border border-border bg-card p-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          {draft.id ? "Editar producto" : "Nuevo producto"}
        </h2>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Volver
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" required value={draft.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Dirección web (slug)</Label>
          <Input
            id="slug"
            required
            placeholder="shampoo-con-cera"
            value={draft.slug}
            onChange={(e) => set("slug", e.target.value.toLowerCase())}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Input id="category" value={draft.category} onChange={(e) => set("category", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="size">Presentación</Label>
          <Input id="size" placeholder="500 ml" value={draft.size} onChange={(e) => set("size", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Precio (USD)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={draft.price}
            onChange={(e) => set("price", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Orden</Label>
          <Input
            id="sortOrder"
            type="number"
            min="0"
            value={draft.sortOrder}
            onChange={(e) => set("sortOrder", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tagline">Frase corta</Label>
        <Input id="tagline" value={draft.tagline} onChange={(e) => set("tagline", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="benefit">Beneficio principal</Label>
        <Input id="benefit" value={draft.benefit} onChange={(e) => set("benefit", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          rows={4}
          value={draft.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="features">Características (una por línea)</Label>
        <Textarea
          id="features"
          rows={5}
          value={draft.features}
          onChange={(e) => set("features", e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Áreas</Label>
          <Chips options={AREA_OPTIONS} values={draft.areas} onToggle={(v) => toggle("areas", v)} />
        </div>
        <div className="space-y-2">
          <Label>Necesidades</Label>
          <Chips options={NEED_OPTIONS} values={draft.needs} onToggle={(v) => toggle("needs", v)} />
        </div>
        <div className="space-y-2">
          <Label>Resultados</Label>
          <Chips options={RESULT_OPTIONS} values={draft.results} onToggle={(v) => toggle("results", v)} />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Imágenes</Label>
        <div className="flex flex-wrap gap-3">
          {draft.images.map((url, i) => (
            <div key={`${url}-${i}`} className="relative h-24 w-24 overflow-hidden rounded-lg border border-border">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => set("images", draft.images.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 rounded bg-background/90 px-1.5 text-xs text-foreground"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
        />
        <Button type="button" variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? "Subiendo…" : "Agregar imagen"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Switch checked={draft.visible} onCheckedChange={(v) => set("visible", v)} /> Visible en el sitio
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Switch checked={draft.available} onCheckedChange={(v) => set("available", v)} /> Disponible
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Switch checked={draft.featured} onCheckedChange={(v) => set("featured", v)} /> Destacado
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Guardando…" : "Guardar producto"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------- Pedidos ------------------------------- */

function OrdersPanel() {
  const queryClient = useQueryClient();
  const list = useServerFn(adminListOrders);
  const update = useServerFn(updateOrderStatus);
  const orders = useQuery({ queryKey: ["admin-orders"], queryFn: () => list() });

  const mutation = useMutation({
    mutationFn: (v: { id: string; status: (typeof ORDER_STATUSES)[number] }) => update({ data: v }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
    onError: () => toast.error("No se pudo actualizar el pedido"),
  });

  if (orders.isLoading) return <p className="text-muted-foreground">Cargando pedidos…</p>;
  const rows = orders.data ?? [];
  if (rows.length === 0) return <p className="text-muted-foreground">Todavía no hay pedidos.</p>;

  return (
    <div className="grid gap-3">
      {rows.map((o) => {
        const items = Array.isArray(o.items) ? (o.items as { name?: string; quantity?: number }[]) : [];
        return (
          <div key={o.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-foreground">
                  {o.order_number} · {o.customer_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(o.created_at).toLocaleString("es-SV")} · {o.customer_email} · {o.customer_phone}
                </p>
              </div>
              <select
                value={o.status}
                onChange={(e) =>
                  mutation.mutate({ id: o.id, status: e.target.value as (typeof ORDER_STATUSES)[number] })
                }
                className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {o.delivery_method} · {o.payment_method} · Total ${Number(o.total).toFixed(2)}
            </p>
            {items.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                {items.map((it, i) => (
                  <li key={i}>
                    {it.quantity ?? 1} × {it.name ?? "Producto"}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------- Mensajes ------------------------------- */

function MessagesPanel() {
  const queryClient = useQueryClient();
  const list = useServerFn(adminListMessages);
  const update = useServerFn(updateMessageStatus);
  const messages = useQuery({ queryKey: ["admin-messages"], queryFn: () => list() });

  const mutation = useMutation({
    mutationFn: (v: { id: string; status: "nuevo" | "atendido" }) => update({ data: v }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-messages"] }),
    onError: () => toast.error("No se pudo actualizar el mensaje"),
  });

  if (messages.isLoading) return <p className="text-muted-foreground">Cargando mensajes…</p>;
  const rows = messages.data ?? [];
  if (rows.length === 0) return <p className="text-muted-foreground">Todavía no hay mensajes.</p>;

  return (
    <div className="grid gap-3">
      {rows.map((m) => (
        <div key={m.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium text-foreground">
                {m.subject} · {m.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(m.created_at).toLocaleString("es-SV")} · {m.email} · {m.phone} · prefiere {m.channel}
              </p>
            </div>
            <Button
              size="sm"
              variant={m.status === "atendido" ? "outline" : "default"}
              onClick={() =>
                mutation.mutate({ id: m.id, status: m.status === "atendido" ? "nuevo" : "atendido" })
              }
            >
              {m.status === "atendido" ? "Marcar como nuevo" : "Marcar atendido"}
            </Button>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm text-foreground">{m.message}</p>
        </div>
      ))}
    </div>
  );
}
