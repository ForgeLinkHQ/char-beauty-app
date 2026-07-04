import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SERVICES, CATEGORY_LABEL, CATEGORY_ORDER, formatGbp, formatDuration } from "@/lib/services";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Prices — C. Beauty · Farnborough" },
      { name: "description", content: "Full menu: lash extensions, facials, chemical peels, LED, spray tans and brow waxing in Farnborough, Hampshire." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-14 lg:px-10 lg:pt-24 lg:pb-20">
          <p className="eyebrow">Menu · 2026</p>
          <h1 className="mt-6 text-5xl md:text-7xl">Services & prices</h1>
          <p className="mt-8 max-w-2xl text-base text-muted-foreground leading-relaxed">
            Every appointment is built around you. Prices below include the consultation and the standard
            aftercare that comes with the treatment. A deposit is taken at booking and comes off the total.
          </p>
        </div>
      </section>

      {CATEGORY_ORDER.map((cat) => {
        const items = SERVICES.filter(s => s.category === cat);
        return (
          <section id={cat} key={cat} className="border-b border-border last:border-0 scroll-mt-24">
            <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
                <div className="md:col-span-4 md:sticky md:top-24 md:self-start">
                  <p className="eyebrow">Category</p>
                  <h2 className="mt-4 font-serif text-3xl md:text-4xl">{CATEGORY_LABEL[cat]}</h2>
                </div>
                <div className="md:col-span-8">
                  <ul>
                    {items.map((s) => (
                      <li key={s.slug} className="border-t border-border py-6 first:border-t-0 first:pt-0">
                        <div className="flex items-baseline justify-between gap-6">
                          <h3 className="font-serif text-xl">{s.name}</h3>
                          <span className="whitespace-nowrap text-sm">{formatGbp(s.priceGbp)}</span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                          <span>{formatDuration(s.durationMinutes)}</span>
                          <span aria-hidden>·</span>
                          <span>Deposit {formatGbp(s.depositGbp)}</span>
                          {s.requiresPatchTest && <><span aria-hidden>·</span><span className="text-accent">Patch test 48h before</span></>}
                          {s.requiresConsultation && <><span aria-hidden>·</span><span className="text-accent">Consultation on first visit</span></>}
                        </div>
                        <div className="mt-4">
                          <Link
                            to="/book"
                            search={{ service: s.slug }}
                            className="text-[11px] uppercase tracking-[0.28em] border-b border-foreground pb-0.5 hover:text-accent hover:border-accent"
                          >
                            Book {s.name}
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <SiteFooter />
    </div>
  );
}
