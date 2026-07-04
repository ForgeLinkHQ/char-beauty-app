import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SERVICES, CATEGORY_LABEL, CATEGORY_ORDER, formatGbp, formatDuration } from "@/lib/services";
import heroLashes from "@/assets/hero-lashes.jpg";
import studioInterior from "@/assets/studio-interior.jpg";
import servicesFacial from "@/assets/services-facial.jpg";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "C. Beauty — Lash Extensions & Skincare Studio · Farnborough" },
      { name: "description", content: "A quiet studio in Farnborough, Hampshire for lash extensions, facials, chemical peels, LED, spray tans and brow waxing. Book online with a small deposit." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = SERVICES.filter(s => ["classic-lash-set","volume-lash-set","signature-facial","spray-tan"].includes(s.slug));

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pt-16 pb-24 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:pt-24 lg:pb-32">
          <div className="lg:col-span-6 lg:pt-12">
            <p className="eyebrow">Est. Farnborough · Hampshire</p>
            <h1 className="mt-8 text-5xl leading-[1.02] md:text-6xl lg:text-7xl">
              Lash artistry &<br />considered skincare.
            </h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
              A private, one-to-one studio for individual eyelash extensions, results-led facials,
              chemical peels, LED, spray tanning and brow work. Every appointment mapped to you.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/book" className="inline-flex items-center gap-3 border border-foreground bg-foreground px-8 py-3.5 text-[11px] tracking-[0.28em] uppercase text-background hover:bg-transparent hover:text-foreground transition-colors">
                Book an appointment <ArrowRight className="size-3.5" />
              </Link>
              <Link to="/services" className="text-[11px] tracking-[0.28em] uppercase border-b border-foreground/60 pb-1 hover:border-accent hover:text-accent transition-colors">
                Explore services
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={heroLashes}
                alt="Close-up of individual lash extensions"
                width={1600}
                height={1920}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted-foreground">
              <span>N.º 01 — Individual lashes</span>
              <span>Farnborough</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Services · The menu</p>
              <h2 className="mt-6 max-w-lg text-4xl md:text-5xl">
                Six disciplines. One pair of hands.
              </h2>
            </div>
            <Link to="/services" className="text-[11px] uppercase tracking-[0.28em] border-b border-foreground pb-1 hover:text-accent hover:border-accent">
              View full menu
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-2 md:grid-cols-2 lg:grid-cols-3">
            {CATEGORY_ORDER.map((cat, i) => (
              <Link
                key={cat}
                to="/services"
                hash={cat}
                className="group flex items-baseline justify-between border-b border-border py-6 transition-colors hover:border-accent"
              >
                <div>
                  <span className="mr-4 text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-serif text-2xl group-hover:text-accent transition-colors">{CATEGORY_LABEL[cat]}</span>
                </div>
                <ArrowRight className="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / editorial */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-24 lg:grid-cols-12 lg:gap-20 lg:px-10 lg:py-32">
          <div className="lg:col-span-5">
            <img src={studioInterior} alt="C. Beauty studio interior" width={1600} height={1200} loading="lazy" className="aspect-[4/5] w-full object-cover" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
            <p className="eyebrow">The studio</p>
            <h2 className="mt-6 text-4xl md:text-5xl">A quiet place to feel like yourself, considered.</h2>
            <p className="mt-8 text-base leading-relaxed text-muted-foreground max-w-lg">
              C. Beauty is a solo studio. That means one appointment at a time, no rush, and treatments mapped to
              your face, skin, lash line and life. Consultations, patch tests and aftercare are woven in — not
              tacked on.
            </p>
            <Link to="/about" className="mt-10 inline-block text-[11px] uppercase tracking-[0.28em] border-b border-foreground pb-1 hover:text-accent hover:border-accent">
              About C.
            </Link>
          </div>
        </div>
      </section>

      {/* Featured services grid */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Signatures</p>
              <h2 className="mt-6 text-4xl md:text-5xl">Most-booked</h2>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-4">
            {featured.map((s, i) => (
              <Link key={s.slug} to="/book" search={{ service: s.slug }} className="group block">
                <div className="aspect-[3/4] overflow-hidden bg-muted">
                  <img
                    src={i === 2 ? servicesFacial : i === 3 ? servicesFacial : heroLashes}
                    alt={s.name}
                    width={1200}
                    height={1500}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between">
                  <h3 className="font-serif text-xl">{s.name}</h3>
                  <span className="text-sm text-muted-foreground">{formatGbp(s.priceGbp)}</span>
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{formatDuration(s.durationMinutes)} · Deposit {formatGbp(s.depositGbp)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:py-32">
          <p className="eyebrow">Booking</p>
          <h2 className="mt-6 text-4xl md:text-5xl">Reserve your place with a small deposit.</h2>
          <p className="mt-6 text-sm text-muted-foreground max-w-xl mx-auto">
            Choose your service, pick a time and secure the appointment with a card. We'll take care of forms,
            patch tests and reminders — you just show up.
          </p>
          <div className="mt-10">
            <Link to="/book" className="inline-flex items-center gap-3 border border-foreground bg-foreground px-10 py-4 text-[11px] tracking-[0.28em] uppercase text-background hover:bg-transparent hover:text-foreground transition-colors">
              Book now <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
