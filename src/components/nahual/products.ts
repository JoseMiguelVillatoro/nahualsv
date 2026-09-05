/** Área del vehículo que atiende el producto */
export type Area = "exterior" | "interior" | "ambos";
/** Necesidad principal */
export type Need = "limpieza" | "brillo" | "proteccion" | "mantenimiento";
/** Resultado buscado */
export type Result = "limpieza-profunda" | "acabado-premium" | "proteccion" | "mantenimiento-diario";

export const AREA_OPTIONS: { value: Area; label: string }[] = [
  { value: "exterior", label: "Exterior" },
  { value: "interior", label: "Interior" },
  { value: "ambos", label: "Ambos" },
];
export const NEED_OPTIONS: { value: Need; label: string }[] = [
  { value: "limpieza", label: "Limpieza" },
  { value: "brillo", label: "Brillo" },
  { value: "proteccion", label: "Protección" },
  { value: "mantenimiento", label: "Mantenimiento" },
];
export const RESULT_OPTIONS: { value: Result; label: string }[] = [
  { value: "limpieza-profunda", label: "Limpieza profunda" },
  { value: "acabado-premium", label: "Acabado premium" },
  { value: "proteccion", label: "Protección" },
  { value: "mantenimiento-diario", label: "Mantenimiento diario" },
];

export type Product = {
  id: string;
  /** URL slug: /producto/:slug */
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  /** Beneficio principal (una línea, para el Asesor Nahual) */
  benefit: string;
  features: string[];
  /** Precio en USD */
  price: number;
  size: string;
  /** Disponibilidad en catálogo */
  available: boolean;
  /** Se muestra en el sitio público */
  visible: boolean;
  /** Aparece en el carrusel de destacados */
  featured: boolean;
  sortOrder: number;
  /** Atributos para catálogo, filtros y recomendación */
  attributes: { areas: Area[]; needs: Need[]; results: Result[] };
  /** Primera imagen = imagen principal */
  images: string[];
  image: string;
};

/** Fila cruda de la base de datos → Product */
export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  benefit: string;
  features: string[];
  price: number | string;
  size: string;
  available: boolean;
  visible: boolean;
  featured: boolean;
  sort_order: number;
  areas: string[];
  needs: string[];
  results: string[];
  images: string[];
};

export function rowToProduct(r: ProductRow): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category,
    tagline: r.tagline,
    description: r.description,
    benefit: r.benefit,
    features: r.features ?? [],
    price: Number(r.price),
    size: r.size,
    available: r.available,
    visible: r.visible,
    featured: r.featured,
    sortOrder: r.sort_order,
    attributes: {
      areas: (r.areas ?? []) as Area[],
      needs: (r.needs ?? []) as Need[],
      results: (r.results ?? []) as Result[],
    },
    images: r.images ?? [],
    image: r.images?.[0] ?? "",
  };
}

export function formatPrice(price: number) {
  return price > 0 ? `$${price.toFixed(2)}` : "Precio a confirmar";
}

/** Recomendación simple basada en los atributos del catálogo. */
export function recommendProduct(products: Product[], area: Area, need: Need, result: Result) {
  const scored = products
    .filter((p) => p.available)
    .map((p) => {
      let score = 0;
      if (p.attributes.areas.includes(area) || area === "ambos" || p.attributes.areas.includes("ambos"))
        score += p.attributes.areas.includes(area) ? 3 : 1;
      if (p.attributes.needs.includes(need)) score += 3;
      if (p.attributes.results.includes(result)) score += 3;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored[0]?.p ?? null;
}
