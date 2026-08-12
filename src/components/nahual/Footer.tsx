import { Instagram, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer id="contacto" className="nahual-pattern-light relative bg-navy-deep py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:grid-cols-3 lg:px-8">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm text-navy-foreground/60">
            Productos para cuidado, limpieza y detailing automotriz. Hecho en El Salvador.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-navy-foreground">Navegación</h3>
          <ul className="mt-4 space-y-2 text-sm text-navy-foreground/60">
            {[
              ["Productos", "#productos"],
              ["Nosotros", "#nosotros"],
              ["Contacto", "#contacto"],
            ].map(([l, h]) => (
              <li key={l}>
                <a href={h} className="transition-colors hover:text-primary">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-navy-foreground">Contacto</h3>
          <ul className="mt-4 space-y-3 text-sm text-navy-foreground/60">
            <li className="flex items-center gap-2">
              <Instagram size={16} className="text-primary" />
              Instagram — [pendiente]
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle size={16} className="text-primary" />
              WhatsApp — [pendiente]
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-navy-foreground/10 px-5 pt-6 text-xs text-navy-foreground/40 lg:px-8">
        © {new Date().getFullYear()} Nahual Auto. Todos los derechos reservados.
      </div>
    </footer>
  );
}
