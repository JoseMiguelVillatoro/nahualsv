import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { CartButton } from "./CartDrawer";

const links = [
  { label: "Inicio", hash: "inicio" },
  { label: "Productos", hash: "productos" },
  { label: "Nosotros", hash: "nosotros" },
  { label: "Contacto", hash: "contacto" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-border bg-secondary/95 shadow-sm backdrop-blur-md" : "bg-secondary"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" hash="inicio" aria-label="Nahual Auto inicio">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <Link
              key={l.hash}
              to="/"
              hash={l.hash}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            hash="productos"
            className="hidden rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark md:inline-flex"
          >
            Ver productos
          </Link>
          <CartButton />
          <button
            className="text-foreground md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-5 pb-6 pt-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.hash}
              to="/"
              hash={l.hash}
              onClick={() => setOpen(false)}
              className="block py-3 text-base font-medium text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/"
            hash="productos"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-lg bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground"
          >
            Ver productos
          </Link>
        </div>
      )}
    </header>
  );
}
