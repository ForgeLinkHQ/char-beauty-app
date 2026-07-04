import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Offers & Gifting — C. Beauty · Farnborough" },
      { name: "description", content: "Seasonal offers, gift cards, referral rewards and loyalty from C. Beauty in Farnborough." },
    ],
  }),
  component: OffersPage,
});

const CARDS = [
  { eyebrow: "First-visit", title: "£10 off your first lash set", body: "Book any full lash set as a first-time client and £10 comes off automatically at checkout.", cta: "Book now", to: "/services" },
  { eyebrow: "Gift", title: "Gift cards", body: "Beautiful digital gift cards from £25, delivered on the date you choose.", cta: "Coming soon", to: "/contact" },
  { eyebrow: "Refer", title: "Bring a friend, get £10", body: "Share your personal link from your account and you both get £10 credit on the next visit.", cta: "How it works", to: "/contact" },
  { eyebrow: "Loyalty", title: "Every 6th visit is on us", body: "Points build automatically as you visit. No card to carry, no fine print.", cta: "Read more", to: "/about" },
];

function OffersPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-14 lg:px-10 lg:pt-24 lg:pb-20">
          <p className="eyebrow">Offers & gifting</p>
          <h1 className="mt-6 text-5xl md:text-7xl">Small ways to say thank you.</h1>
        </div>
      </section>
      <section>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-20 md:grid-cols-2 lg:px-10">
          {CARDS.map((c) => (
            <article key={c.title} className="border border-border p-10 lg:p-14">
              <p className="eyebrow">{c.eyebrow}</p>
              <h2 className="mt-6 font-serif text-3xl">{c.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              <Link to={c.to} className="mt-8 inline-block text-[11px] uppercase tracking-[0.28em] border-b border-foreground pb-1 hover:text-accent hover:border-accent">{c.cta}</Link>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
