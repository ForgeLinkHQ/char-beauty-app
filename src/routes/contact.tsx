import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Mail, Instagram, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — C. Beauty · Farnborough" },
      { name: "description", content: "Get in touch with C. Beauty in Farnborough, Hampshire — hello@cbeauty.studio or Instagram @cbeauty.studio." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 pt-16 pb-24 lg:grid-cols-12 lg:gap-20 lg:px-10 lg:pt-24">
          <div className="lg:col-span-6">
            <p className="eyebrow">Contact</p>
            <h1 className="mt-6 text-5xl md:text-6xl">Say hello.</h1>
            <p className="mt-8 text-base leading-relaxed text-muted-foreground max-w-lg">
              For bookings, please use the online booking system — it's the fastest way to see live availability.
              For anything else, drop a note. Replies are within 24 hours, Monday to Saturday.
            </p>
            <ul className="mt-10 space-y-6 text-sm">
              <li className="flex items-start gap-4"><Mail className="size-5 text-accent mt-0.5" /><div><p className="eyebrow !text-foreground">Email</p><a href="mailto:hello@cbeauty.studio" className="mt-1 block hover:text-accent">hello@cbeauty.studio</a></div></li>
              <li className="flex items-start gap-4"><Instagram className="size-5 text-accent mt-0.5" /><div><p className="eyebrow !text-foreground">Instagram</p><a href="https://instagram.com/cbeauty.studio" className="mt-1 block hover:text-accent">@cbeauty.studio</a></div></li>
              <li className="flex items-start gap-4"><MapPin className="size-5 text-accent mt-0.5" /><div><p className="eyebrow !text-foreground">Studio</p><p className="mt-1">Farnborough, Hampshire, UK<br /><span className="text-muted-foreground">Full address shared on booking</span></p></div></li>
              <li className="flex items-start gap-4"><Clock className="size-5 text-accent mt-0.5" /><div><p className="eyebrow !text-foreground">Opening hours</p><p className="mt-1">Tue–Sat, 9am–6pm<br /><span className="text-muted-foreground">Evenings on request</span></p></div></li>
            </ul>
          </div>
          <div className="lg:col-span-6">
            <div className="border border-border p-8 lg:p-12">
              <p className="eyebrow">Send a note</p>
              <form className="mt-6 space-y-5">
                <div>
                  <label className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Name</label>
                  <input className="mt-2 w-full border-b border-border bg-transparent py-2 focus:border-foreground focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Email</label>
                  <input type="email" className="mt-2 w-full border-b border-border bg-transparent py-2 focus:border-foreground focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Message</label>
                  <textarea rows={5} className="mt-2 w-full border-b border-border bg-transparent py-2 focus:border-foreground focus:outline-none resize-none" />
                </div>
                <button type="button" className="w-full border border-foreground bg-foreground px-6 py-3 text-[11px] tracking-[0.28em] uppercase text-background hover:bg-transparent hover:text-foreground transition-colors">
                  Send message
                </button>
                <p className="text-xs text-muted-foreground">Contact form coming online shortly — for now, email is fastest.</p>
              </form>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
