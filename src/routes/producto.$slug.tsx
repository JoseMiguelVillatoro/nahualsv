import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/nahual/Header";
import { Footer } from "@/components/nahual/Footer";
import { ProductDetail } from "@/components/nahual/ProductDetail";
import { getProductBySlug } from "@/components/nahual/products";

export const Route = createFileRoute("/producto/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Producto no disponible | Nahual Auto" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} | Nahual Auto`;
    return {
      meta: [
        { title },
        { name: "description", content: product.tagline },
        { property: "og:title", content: title },
        { property: "og:description", content: product.tagline },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
  errorComponent: ProductError,
  notFoundComponent: ProductNotFound,
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function ProductPage() {
  const { product } = Route.useLoaderData();
  return (
    <Shell>
      <ProductDetail product={product} />
    </Shell>
  );
}

function ProductNotFound() {
  return (
    <Shell>
      <div className="mx-auto max-w-2xl px-5 py-40 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Producto no encontrado</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          El producto que buscas no existe o fue movido.
        </p>
        <Link
          to="/"
          hash="productos"
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Ver catálogo
        </Link>
      </div>
    </Shell>
  );
}

function ProductError() {
  return (
    <Shell>
      <div className="mx-auto max-w-2xl px-5 py-40 text-center">
        <h1 className="text-2xl font-semibold text-foreground">No pudimos cargar el producto</h1>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Ir al inicio
        </Link>
      </div>
    </Shell>
  );
}
