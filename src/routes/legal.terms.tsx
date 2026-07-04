import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Terms — C. Beauty" },
      { name: "description", content: "Booking, deposit, cancellation and studio policies for C. Beauty." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 py-20 lg:px-10 lg:py-28">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-6 text-5xl">Booking & studio terms</h1>
        <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p><strong className="text-foreground">Deposits.</strong> A card deposit is taken at booking and comes off your treatment total. Deposits are non-refundable inside 48 hours of your appointment.</p>
          <p><strong className="text-foreground">Cancellation.</strong> Please give at least 48 hours' notice to reschedule without losing your deposit.</p>
          <p><strong className="text-foreground">Patch tests.</strong> First-time clients for lash extensions, tinting, chemical peels or spray tan must complete a patch test at least 48 hours before the treatment.</p>
          <p><strong className="text-foreground">Late arrivals.</strong> Arriving more than 15 minutes late may mean the treatment is shortened or rescheduled.</p>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
