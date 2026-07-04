import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SERVICES, CATEGORY_LABEL, CATEGORY_ORDER, formatGbp, formatDuration } from "@/lib/services";

const searchSchema = z.object({
  service: z.string().optional(),
});

export const Route = createFileRoute("/book")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Book an appointment — C. Beauty · Farnborough" },
      { name: "description", content: "Book lashes, facials, peels, LED, tan or brows online with C. Beauty in Farnborough. Secure your slot with a small deposit." },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  const { service } = Route.useSearch();
  const selected = SERVICES.find(s => s.slug === service);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-14 lg:px-10 lg:pt-24 lg:pb-20">
          <p className="eyebrow">Book · Step 1 of 5</p>
          <h1 className="mt-6 text-5xl md:text-6xl">Choose your service.</h1>
          <p className="mt-6 max-w-xl text-sm text-muted-foreground">
            Pick the treatment you'd like. On the next step you'll see live availability and secure the slot
            with a small card deposit that comes off your total.
          </p>
          {selected && (
            <div className="mt-8 inline-flex items-center gap-3 border border-accent bg-accent/10 px-5 py-3 text-xs uppercase tracking-[0.22em]">
              Selected · <strong className="font-medium">{selected.name}</strong> · {formatGbp(selected.priceGbp)}
            </div>
          )}
        </div>
      </section>

      {CATEGORY_ORDER.map((cat) => {
        const items = SERVICES.filter(s => s.category === cat);
        return (
          <section key={cat} className="border-b border-border last:border-0">
            <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                <div className="md:col-span-4">
                  <p className="eyebrow">Category</p>
                  <h2 className="mt-3 font-serif text-2xl">{CATEGORY_LABEL[cat]}</h2>
                </div>
                <div className="md:col-span-8">
                  <ul className="divide-y divide-border">
                    {items.map((s) => {
                      const isSelected = s.slug === service;
                      return (
                        <li key={s.slug} className={`py-5 ${isSelected ? "" : ""}`}>
                          <Link
                            to="/book"
                            search={{ service: s.slug }}
                            className="group flex items-baseline justify-between gap-6"
                          >
                            <div>
                              <h3 className={`font-serif text-lg ${isSelected ? "text-accent" : "group-hover:text-accent transition-colors"}`}>{s.name}</h3>
                              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                                {formatDuration(s.durationMinutes)} · Deposit {formatGbp(s.depositGbp)}
                                {s.requiresPatchTest && " · Patch test 48h"}
                                {s.requiresConsultation && " · Consultation"}
                              </p>
                            </div>
                            <span className="whitespace-nowrap text-sm">{formatGbp(s.priceGbp)}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:py-24">
          <p className="eyebrow">Coming next</p>
          <h2 className="mt-4 font-serif text-2xl">Live availability, forms and secure deposit checkout</h2>
          <p className="mt-4 text-sm text-muted-foreground max-w-xl mx-auto">
            The calendar and deposit checkout come online in the next update — including automatic patch-test
            scheduling and returning-client sign-in. For now, please email <a className="underline" href="mailto:hello@cbeauty.studio">hello@cbeauty.studio</a> to reserve your slot.
          </p>
          <div className="mt-8">
            <Link to="/contact" className="inline-block border border-foreground bg-foreground px-8 py-3 text-[11px] tracking-[0.28em] uppercase text-background hover:bg-transparent hover:text-foreground transition-colors">
              Enquire about a slot
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
