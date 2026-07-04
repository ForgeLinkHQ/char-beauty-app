import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl">C.</span>
              <span className="eyebrow !text-foreground">Beauty</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A quiet studio in Farnborough for lash extensions, facials, peels, LED,
              spray tans and brow work. Considered, luxurious, deeply personal.
            </p>
          </div>
          <div>
            <p className="eyebrow">Studio</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-accent">Services</Link></li>
              <li><Link to="/about" className="hover:text-accent">About</Link></li>
              <li><Link to="/gallery" className="hover:text-accent">Gallery</Link></li>
              <li><Link to="/offers" className="hover:text-accent">Offers & gifting</Link></li>
              <li><Link to="/book" className="hover:text-accent">Book</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">Contact</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2"><MapPin className="size-4 mt-0.5 shrink-0" /> Farnborough, Hampshire, UK</li>
              <li className="flex items-start gap-2"><Mail className="size-4 mt-0.5 shrink-0" /> hello@cbeauty.studio</li>
              <li className="flex items-start gap-2"><Instagram className="size-4 mt-0.5 shrink-0" /> @cbeauty.studio</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} C. Beauty. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/legal/privacy" className="hover:text-accent">Privacy</Link>
            <Link to="/legal/terms" className="hover:text-accent">Terms</Link>
            <Link to="/auth" className="hover:text-accent">Owner</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
