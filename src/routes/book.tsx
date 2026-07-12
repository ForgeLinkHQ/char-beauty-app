import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { BookingWizard } from "@/components/site/booking-wizard";

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

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <BookingWizard initialSlug={service} />
      <SiteFooter />
    </div>
  );
}
