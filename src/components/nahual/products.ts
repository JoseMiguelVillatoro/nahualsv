import p1 from "@/assets/p1.png.asset.json";
import p2 from "@/assets/p2.png.asset.json";
import p3 from "@/assets/p3.png.asset.json";
import p4 from "@/assets/p4.png.asset.json";

export type Product = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  features: string[];
  image: string;
};

export const products: Product[] = [
  {
    id: "shampoo-con-cera",
    name: "Shampoo con cera",
    category: "Shampoo automotriz",
    tagline: "Limpieza + brillo en un solo producto.",
    features: [
      "pH neutro",
      "Suciedad media",
      "Acabado brillante",
      "Uso en carrocería y rines",
      "Rinde hasta 30 lavadas",
    ],
    image: p1.url,
  },
  {
    id: "shampoo-sin-cera",
    name: "Shampoo sin cera",
    category: "Shampoo automotriz",
    tagline: "Limpieza profunda para remover suciedad más intensa.",
    features: [
      "pH neutro",
      "Suciedad fuerte",
      "Brillo medio",
      "Uso en carrocería y rines",
      "Rinde hasta 30 lavadas",
    ],
    image: p2.url,
  },
  {
    id: "el-limpiador",
    name: "El Limpiador",
    category: "Producto de limpieza",
    tagline: "Producto especializado para el cuidado de tu vehículo.",
    features: [],
    image: p3.url,
  },
  {
    id: "silicon-interiores",
    name: "Silicón para interiores",
    category: "Cuidado interior",
    tagline: "Protege y revitaliza las superficies interiores de tu vehículo.",
    features: [],
    image: p4.url,
  },
];
