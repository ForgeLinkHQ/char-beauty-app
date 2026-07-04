import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import heroLashes from "@/assets/hero-lashes.jpg";
import studioInterior from "@/assets/studio-interior.jpg";
import servicesFacial from "@/assets/services-facial.jpg";
import servicesTan from "@/assets/services-tan.jpg";
import servicesBrows from "@/assets/services-brows.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — C. Beauty · Farnborough" },
      { name: "description", content: "A quiet gallery of work from C. Beauty — lashes, facials, brows and the studio itself." },
    ],
  }),
  component: GalleryPage,
});

const IMAGES = [
  { src: heroLashes, tag: "Lashes", ratio: "aspect-[4/5]" },
  { src: studioInterior, tag: "The studio", ratio: "aspect-[4/3]" },
  { src: servicesFacial, tag: "Facials", ratio: "aspect-[4/5]" },
  { src: servicesBrows, tag: "Brows", ratio: "aspect-[4/5]" },
  { src: servicesTan, tag: "Tan", ratio: "aspect-[4/5]" },
  { src: heroLashes, tag: "Volume lashes", ratio: "aspect-[4/3]" },
];

function GalleryPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-14 lg:px-10 lg:pt-24 lg:pb-20">
          <p className="eyebrow">Gallery</p>
          <h1 className="mt-6 text-5xl md:text-7xl">The work.</h1>
          <p className="mt-8 max-w-xl text-base text-muted-foreground leading-relaxed">
            A slow, evolving edit of recent lash sets, facials, brows and moments in the studio.
          </p>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="columns-1 gap-8 md:columns-2 lg:columns-3">
            {IMAGES.map((img, i) => (
              <figure key={i} className="mb-8 break-inside-avoid">
                <div className={`${img.ratio} overflow-hidden bg-muted`}>
                  <img src={img.src} alt={img.tag} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <figcaption className="mt-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">{img.tag} · N.º {String(i+1).padStart(2,"0")}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
