import heroAsset from "@/assets/hero.webp.asset.json";
import p1Asset from "@/assets/p1.webp.asset.json";
import p2Asset from "@/assets/p2.webp.asset.json";
import p3Asset from "@/assets/p3.webp.asset.json";
import p4Asset from "@/assets/p4.webp.asset.json";

const hero = heroAsset.url;
const p1 = p1Asset.url;
const p2 = p2Asset.url;
const p3 = p3Asset.url;
const p4 = p4Asset.url;

/** Área del vehículo que atiende el producto */
export type Area = "exterior" | "interior" | "ambos";
/** Necesidad principal */
export type Need = "limpieza" | "brillo" | "proteccion" | "mantenimiento";
/** Resultado buscado */
export type Result = "limpieza-profunda" | "acabado-premium" | "proteccion" | "mantenimiento-diario";

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
  /** Precio de referencia en USD. Editar aquí — fuente única de verdad. */
  price: number;
  size: string;
  /** Disponibilidad en catálogo */
  available: boolean;
  /** Atributos para catálogo, filtros y recomendación */
  attributes: { areas: Area[]; needs: Need[]; results: Result[] };
  /** Primera imagen = imagen principal */
  images: string[];
  image: string;
};

const DEFAULT_SIZE = "500 ml";


export const products: Product[] = [
  {
    id: "shampoo-con-cera",
    slug: "shampoo-con-cera",
    name: "Shampoo con cera",
    category: "Shampoo automotriz",
    tagline: "Limpieza + brillo en un solo producto.",
    description:
      "Limpieza + brillo en un solo producto. Fórmula de pH neutro, ideal para suciedad media.",
    benefit: "Limpia y deja acabado brillante en un solo paso.",
    features: [
      "pH neutro",
      "Suciedad media",
      "Acabado brillante",
      "Uso en carrocería y rines",
      "Rinde hasta 30 lavadas",
    ],
    price: 12.5,
    size: DEFAULT_SIZE,
    available: true,
    attributes: {
      areas: ["exterior"],
      needs: ["brillo", "limpieza", "proteccion"],
      results: ["acabado-premium", "proteccion"],
    },
    images: [p1, hero],
    image: p1,
  },
  {
    id: "shampoo-sin-cera",
    slug: "shampoo-sin-cera",
    name: "Shampoo sin cera",
    category: "Shampoo automotriz",
    tagline: "Limpieza profunda para remover suciedad más intensa.",
    description:
      "Limpieza profunda para remover suciedad más intensa. Fórmula de pH neutro para uso frecuente.",
    benefit: "Remueve suciedad intensa sin dañar la pintura.",
    features: [
      "pH neutro",
      "Suciedad fuerte",
      "Brillo medio",
      "Uso en carrocería y rines",
      "Rinde hasta 30 lavadas",
    ],
    price: 10.5,
    size: DEFAULT_SIZE,
    available: true,
    attributes: {
      areas: ["exterior"],
      needs: ["limpieza", "mantenimiento"],
      results: ["limpieza-profunda", "mantenimiento-diario"],
    },
    images: [p2, hero],
    image: p2,
  },
  {
    id: "el-limpiador",
    slug: "el-limpiador",
    name: "El Limpiador",
    category: "Producto de limpieza",
    tagline: "Producto especializado para el cuidado de tu vehículo.",
    description:
      "Limpiador multiusos para interiores y exteriores. Remueve polvo, grasa y manchas del día a día sin dañar plásticos, vinil ni pintura.",
    benefit: "Multiusos para limpiar interior y exterior a diario.",
    features: [
      "Fórmula multiusos",
      "Seguro en plásticos y vinil",
      "Remueve grasa y manchas",
      "Uso interior y exterior",
      "Rinde para uso frecuente",
    ],
    price: 7.5,
    size: DEFAULT_SIZE,
    available: true,
    attributes: {
      areas: ["ambos", "interior", "exterior"],
      needs: ["limpieza", "mantenimiento"],
      results: ["limpieza-profunda", "mantenimiento-diario"],
    },
    images: [p3, hero],
    image: p3,
  },
  {
    id: "silicon-interiores",
    slug: "silicon-para-interiores",
    name: "Silicón para interiores",
    category: "Cuidado interior",
    tagline: "Protege y revitaliza las superficies interiores de tu vehículo.",
    description:
      "Silicón acondicionador para tableros, paneles y plásticos interiores. Revitaliza el color y deja un acabado protector sin sensación grasosa.",
    benefit: "Protege y revitaliza plásticos y tableros.",
    features: [
      "Acabado satinado no grasoso",
      "Revitaliza el color",
      "Protección contra resequedad",
      "Ideal para tablero y paneles",
      "Aroma agradable",
    ],
    price: 9.75,
    size: DEFAULT_SIZE,
    available: true,
    attributes: {
      areas: ["interior"],
      needs: ["proteccion", "brillo", "mantenimiento"],
      results: ["proteccion", "acabado-premium", "mantenimiento-diario"],
    },
    images: [p4, hero],
    image: p4,
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(price: number) {
  return price > 0 ? `$${price.toFixed(2)}` : "Precio a confirmar";
}

/** Recomendación simple basada en los atributos del catálogo. */
export function recommendProduct(area: Area, need: Need, result: Result) {
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
  return scored[0]!.p;
}
