import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/nahual/Header";
import { Hero } from "@/components/nahual/Hero";
import { FeaturedProducts } from "@/components/nahual/FeaturedProducts";
import { WhyNahual } from "@/components/nahual/WhyNahual";
import { ProductFinder } from "@/components/nahual/ProductFinder";
import { BrandSection } from "@/components/nahual/BrandSection";
import { FinalCTA } from "@/components/nahual/FinalCTA";
import { ContactSection } from "@/components/nahual/ContactSection";
import { Footer } from "@/components/nahual/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Reveal } from "@/components/nahual/Reveal";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nahual Auto | Cuidado profesional para tu vehículo" },
      {
        name: "description",
        content:
          "Productos salvadoreños de limpieza y detailing automotriz: shampoo con cera, sin cera, limpiador y silicón para interiores.",
      },
      { property: "og:title", content: "Nahual Auto | Cuidado profesional para tu vehículo" },
      {
        property: "og:description",
        content:
          "Productos Nahual Auto diseñados para limpiar, proteger y mantener tu vehículo como nuevo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Reveal as="section"><FeaturedProducts /></Reveal>
        <Reveal as="section"><WhyNahual /></Reveal>
        <ProductFinder />
        <Reveal as="section"><BrandSection /></Reveal>
        <Reveal as="section"><FinalCTA /></Reveal>
        <Reveal as="section"><ContactSection /></Reveal>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

