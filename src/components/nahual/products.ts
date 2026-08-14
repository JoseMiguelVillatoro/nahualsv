import hero from "@/assets/hero.png.asset.json";
import p1 from "@/assets/p1.png.asset.json";
import p2 from "@/assets/p2.png.asset.json";
import p3 from "@/assets/p3.png.asset.json";
import p4 from "@/assets/p4.png.asset.json";

export type Product = {
  id: string;
  /** URL slug: /producto/:slug */
  slug: string;
  name: string;
  category: string;
  tagline: string;
  /** Descripción larga. PLACEHOLDER cuando no esté confirmada. */
  description: string;
  features: string[];
  /** PLACEHOLDER: precio pendiente de confirmar. Editar aquí. */
  price: number;
  /** PLACEHOLDER: presentación pendiente de confirmar. */
  size: string;
  /** Primera imagen = imagen principal */
  images: string[];
  image: string;
};

const PLACEHOLDER_DESC =
  "PLACEHOLDER: descripción técnica pendiente de confirmar con Nahual Auto. Editar en src/components/nahual/products.ts.";

export const products: Product[] = [
  {
    id: "shampoo-con-cera",
    slug: "shampoo-con-cera",
    name: "Shampoo con cera",
    category: "Shampoo automotriz",
    tagline: "Limpieza + brillo en un solo producto.",
    description:
      "Limpieza + brillo en un solo producto. Fórmula de pH neutro, ideal para suciedad media.",
    features: [
      "pH neutro",
      "Suciedad media",
      "Acabado brillante",
      "Uso en carrocería y rines",
      "Rinde hasta 30 lavadas",
    ],
    price: 0,
    size: "PLACEHOLDER: presentación",
    images: [p1.url, hero.url],
    image: p1.url,
  },
  {
    id: "shampoo-sin-cera",
    slug: "shampoo-sin-cera",
    name: "Shampoo sin cera",
    category: "Shampoo automotriz",
    tagline: "Limpieza profunda para remover suciedad más intensa.",
    description:
      "Limpieza profunda para remover suciedad más intensa. Fórmula de pH neutro para uso frecuente.",
    features: [
      "pH neutro",
      "Suciedad fuerte",
      "Brillo medio",
      "Uso en carrocería y rines",
      "Rinde hasta 30 lavadas",
    ],
    price: 0,
    size: "PLACEHOLDER: presentación",
    images: [p2.url, hero.url],
    image: p2.url,
  },
  {
    id: "el-limpiador",
    slug: "el-limpiador",
    name: "El Limpiador",
    category: "Producto de limpieza",
    tagline: "Producto especializado para el cuidado de tu vehículo.",
    description: PLACEHOLDER_DESC,
    features: [],
    price: 0,
    size: "PLACEHOLDER: presentación",
    images: [p3.url, hero.url],
    image: p3.url,
  },
  {
    id: "silicon-interiores",
    slug: "silicon-para-interiores",
    name: "Silicón para interiores",
    category: "Cuidado interior",
    tagline: "Protege y revitaliza las superficies interiores de tu vehículo.",
    description: PLACEHOLDER_DESC,
    features: [],
    price: 0,
    size: "PLACEHOLDER: presentación",
    images: [p4.url, hero.url],
    image: p4.url,
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(price: number) {
  return price > 0 ? `$${price.toFixed(2)}` : "Precio a confirmar";
}
