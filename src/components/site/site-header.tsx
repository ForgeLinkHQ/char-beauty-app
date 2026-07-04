import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/offers", label: "Offers" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl tracking-tight">C.</span>
          <span className="eyebrow !text-foreground">Beauty</span>
        </Link>
        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-xs uppercase tracking-[0.24em] text-foreground/80 hover:text-accent transition-colors"
              activeProps={{ className: "text-accent" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/book"
            className="hidden md:inline-flex border border-foreground px-6 py-2.5 text-[11px] tracking-[0.28em] uppercase hover:bg-foreground hover:text-background transition-colors"
          >
            Book
          </Link>
          <button
            aria-label="Menu"
            className="md:hidden p-2"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col px-6 py-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-3 text-xs uppercase tracking-[0.24em] border-b border-border/60 last:border-0"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="mt-4 border border-foreground px-6 py-3 text-center text-[11px] tracking-[0.28em] uppercase"
            >
              Book an appointment
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
