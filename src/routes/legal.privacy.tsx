import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — C. Beauty" },
      { name: "description", content: "How C. Beauty handles your personal data under UK GDPR." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 py-20 lg:px-10 lg:py-28">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-6 text-5xl">Privacy notice</h1>
        <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p><strong className="text-foreground">Who we are.</strong> C. Beauty is a beauty studio operating in Farnborough, Hampshire, UK. We are the controller of your personal data.</p>
          <p><strong className="text-foreground">What we collect.</strong> Name, contact details, health information relevant to your treatment, payment records, consent-form submissions, appointment history and any preferences you share with us.</p>
          <p><strong className="text-foreground">Why.</strong> To deliver your treatment safely, take deposits and payments, send reminders and aftercare, and — with your permission — send occasional offers.</p>
          <p><strong className="text-foreground">Your rights.</strong> You can request a copy of your data, ask us to correct or delete it, and unsubscribe from marketing at any time. Email hello@cbeauty.studio.</p>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
