import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import studioInterior from "@/assets/studio-interior.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — C. Beauty · Farnborough" },
      { name: "description", content: "Meet C. — a solo lash and skincare artist in Farnborough, Hampshire. Considered, unhurried treatments with obsessive attention to detail." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 pt-16 pb-24 lg:grid-cols-12 lg:gap-20 lg:px-10 lg:pt-24">
          <div className="lg:col-span-6 lg:pt-12">
            <p className="eyebrow">About</p>
            <h1 className="mt-6 text-5xl md:text-6xl">A quiet obsession with the details.</h1>
            <p className="mt-8 text-base leading-relaxed text-muted-foreground max-w-lg">
              C. Beauty is a one-person studio in Farnborough, Hampshire. Every appointment is with C. herself —
              from the first consultation to the last stroke of the brow brush. It means only one client at a
              time, no rush, and treatments that are actually mapped to your face, your lash line and your life.
            </p>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground max-w-lg">
              Trained in individual lash extensions, chemical peels, LED, spray tanning and brow work, C. keeps
              a small, deliberate menu — done properly — over a big one done in a hurry.
            </p>
          </div>
          <div className="lg:col-span-6">
            <img src={studioInterior} alt="Studio interior" width={1600} height={1200} loading="lazy" className="aspect-[4/5] w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <p className="eyebrow">What to expect</p>
          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              { n: "01", t: "A proper consultation", d: "Before your first treatment we talk skin, lashes, sensitivities and what you actually want the result to feel like." },
              { n: "02", t: "Records, not repeats", d: "Every set, every peel and every brow map is stored to your file — so next time we build on what worked." },
              { n: "03", t: "Aftercare that shows up", d: "Prep and aftercare emails land at the right time, and you can message the studio if anything feels off." },
            ].map(x => (
              <div key={x.n}>
                <p className="font-serif text-3xl text-accent">{x.n}</p>
                <h3 className="mt-4 font-serif text-2xl">{x.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:py-32">
          <p className="eyebrow">Come in</p>
          <h2 className="mt-6 text-4xl md:text-5xl">Ready when you are.</h2>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/book" className="border border-foreground bg-foreground px-8 py-3.5 text-[11px] tracking-[0.28em] uppercase text-background hover:bg-transparent hover:text-foreground transition-colors">Book</Link>
            <Link to="/contact" className="border border-foreground px-8 py-3.5 text-[11px] tracking-[0.28em] uppercase hover:bg-foreground hover:text-background transition-colors">Get in touch</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
