import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Owner sign-in — C. Beauty" },
      { name: "description", content: "Sign in to manage bookings, clients, calendar and marketing." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created — check your email if confirmation is required, otherwise you're in.");
        navigate({ to: "/admin" });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto flex max-w-md flex-col items-center px-6 py-20 lg:py-28">
        <p className="eyebrow">Owner access</p>
        <h1 className="mt-6 text-center text-4xl">The Studio</h1>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Sign in to manage your calendar, clients and marketing.
        </p>

        <form onSubmit={onSubmit} className="mt-10 w-full space-y-5 border border-border p-8">
          <div>
            <label className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full border-b border-border bg-transparent py-2 focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Password</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full border-b border-border bg-transparent py-2 focus:border-foreground focus:outline-none" />
          </div>
          <button disabled={loading} className="w-full border border-foreground bg-foreground px-6 py-3 text-[11px] tracking-[0.28em] uppercase text-background hover:bg-transparent hover:text-foreground transition-colors disabled:opacity-50">
            {loading ? "One moment…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
          <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="w-full text-center text-xs text-muted-foreground hover:text-accent">
            {mode === "signin" ? "First time here? Create an owner account" : "Already have an account? Sign in"}
          </button>
        </form>
      </section>
      <SiteFooter />
    </div>
  );
}
