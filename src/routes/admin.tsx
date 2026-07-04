import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site/site-header";
import { Calendar, Users, Scissors, Settings, Tag, Sparkles, Mail, BarChart3, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Studio · C. Beauty" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminHome,
});

const CARDS = [
  { to: "#calendar", label: "Calendar", icon: Calendar, desc: "See the week at a glance and reschedule with a drag." },
  { to: "#bookings", label: "Bookings", icon: Sparkles, desc: "Every upcoming and past appointment." },
  { to: "#clients", label: "Clients", icon: Users, desc: "Records, tiers, tags, segments and relationships." },
  { to: "#services", label: "Services", icon: Scissors, desc: "Menu, prices, durations and deposits." },
  { to: "#marketing", label: "Marketing", icon: Tag, desc: "Segments, offers, referrals, gift cards, automations." },
  { to: "#inbox", label: "Inbox", icon: Mail, desc: "Enquiries, replies and email log." },
  { to: "#reports", label: "Reports", icon: BarChart3, desc: "Revenue, retention, cohort and LTV." },
  { to: "#settings", label: "Settings", icon: Settings, desc: "Studio hours, forms, integrations." },
];


const CARDS = [
  { to: "/admin/calendar", label: "Calendar", icon: Calendar, desc: "See the week at a glance and reschedule with a drag." },
  { to: "/admin/bookings", label: "Bookings", icon: Sparkles, desc: "Every upcoming and past appointment." },
  { to: "/admin/clients", label: "Clients", icon: Users, desc: "Records, tiers, tags, segments and relationships." },
  { to: "/admin/services", label: "Services", icon: Scissors, desc: "Menu, prices, durations and deposits." },
  { to: "/admin/marketing", label: "Marketing", icon: Tag, desc: "Segments, offers, referrals, gift cards, automations." },
  { to: "/admin/inbox", label: "Inbox", icon: Mail, desc: "Enquiries, replies and email log." },
  { to: "/admin/reports", label: "Reports", icon: BarChart3, desc: "Revenue, retention, cohort and LTV." },
  { to: "/admin/settings", label: "Settings", icon: Settings, desc: "Studio hours, forms, integrations." },
];

function AdminHome() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: "/auth" });
        return;
      }
      setEmail(data.session.user.email ?? null);
      setReady(true);
    });
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Loading studio…</div>;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-10 lg:px-10 lg:pt-20">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">The Studio</p>
              <h1 className="mt-4 text-4xl md:text-5xl">Good to see you.</h1>
              <p className="mt-3 text-sm text-muted-foreground">Signed in as {email}</p>
            </div>
            <button onClick={signOut} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] border-b border-border pb-1 hover:text-accent hover:border-accent">
              <LogOut className="size-3.5" /> Sign out
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {CARDS.map((c) => {
              const Icon = c.icon;
              return (
                <Link key={c.to} to={c.to} className="group block border border-border p-8 transition-colors hover:border-accent">
                  <Icon className="size-6 text-accent" />
                  <h2 className="mt-6 font-serif text-2xl group-hover:text-accent transition-colors">{c.label}</h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </Link>
              );
            })}
          </div>
          <p className="mt-16 text-xs text-muted-foreground text-center">
            More studio tools land as we build out the platform. Suggestions welcome — drop C. a note.
          </p>
        </div>
      </section>
    </div>
  );
}
