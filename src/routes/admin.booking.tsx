import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { ArrowLeft, Loader2, Plus, Trash2, Save } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site/site-header";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/booking")({
  head: () => ({
    meta: [
      { title: "Booking Settings · C. Beauty Studio" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminBookingPage,
});

// ---------------------------------------------------------------------------
// Types (manual until supabase types are regenerated)
// ---------------------------------------------------------------------------

interface BookingSettings {
  timezone: string;
  slot_granularity_minutes: number;
  min_notice_hours: number;
  max_advance_days: number;
  hold_minutes: number;
}

interface BusinessHour {
  id: string;
  day_of_week: number;
  opens_at: string;
  closes_at: string;
}

interface BlackoutPeriod {
  id: string;
  starts_at: string;
  ends_at: string;
  reason: string | null;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

function AdminBookingPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<"settings" | "hours" | "blackouts">("settings");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: "/auth" });
        return;
      }
      setReady(true);
    });
  }, [navigate]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  const tabs = [
    { key: "settings" as const, label: "General" },
    { key: "hours" as const, label: "Business hours" },
    { key: "blackouts" as const, label: "Blackout periods" },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-10 lg:px-10 lg:pt-20">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Studio
          </Link>
          <h1 className="mt-6 text-4xl md:text-5xl">Booking settings</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Control availability, hours, holds and closures.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex gap-8">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`py-4 text-xs uppercase tracking-[0.22em] border-b-2 transition-colors ${
                  tab === t.key
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          {tab === "settings" && <SettingsTab />}
          {tab === "hours" && <HoursTab />}
          {tab === "blackouts" && <BlackoutsTab />}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// General settings tab
// ---------------------------------------------------------------------------

function SettingsTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<BookingSettings | null>(null);

  useEffect(() => {
    supabase
      .from("booking_settings" as never)
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data, error }) => {
        if (error) {
          toast.error("Failed to load booking settings");
        } else {
          setSettings(data as unknown as BookingSettings);
        }
        setLoading(false);
      });
  }, []);

  async function save() {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase
      .from("booking_settings" as never)
      .update(settings as never)
      .eq("id" as never, 1 as never);
    if (error) {
      toast.error("Failed to save settings");
    } else {
      toast.success("Settings saved");
    }
    setSaving(false);
  }

  if (loading) return <LoadingState />;
  if (!settings) return <p className="text-sm text-destructive">Could not load settings.</p>;

  const fields: { key: keyof BookingSettings; label: string; type: string; help: string }[] = [
    { key: "timezone", label: "Studio timezone", type: "text", help: "IANA timezone, e.g. Europe/London" },
    { key: "slot_granularity_minutes", label: "Slot granularity (minutes)", type: "number", help: "Time grid resolution: 15 = slots at :00, :15, :30, :45" },
    { key: "min_notice_hours", label: "Minimum notice (hours)", type: "number", help: "Earliest a client can book before the slot" },
    { key: "max_advance_days", label: "Advance booking window (days)", type: "number", help: "How far ahead clients can book" },
    { key: "hold_minutes", label: "Hold duration (minutes)", type: "number", help: "How long a slot is held before payment is required" },
  ];

  return (
    <div className="max-w-lg space-y-8">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="eyebrow mb-2 block">{f.label}</label>
          <Input
            type={f.type}
            value={settings[f.key]}
            onChange={(e) =>
              setSettings({
                ...settings,
                [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value,
              })
            }
          />
          <p className="mt-1.5 text-xs text-muted-foreground">{f.help}</p>
        </div>
      ))}
      <button
        onClick={save}
        disabled={saving}
        className="inline-flex items-center gap-2 border border-foreground bg-foreground px-8 py-3 text-[11px] tracking-[0.28em] uppercase text-background hover:bg-transparent hover:text-foreground transition-colors disabled:opacity-50"
      >
        {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
        Save settings
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Business hours tab
// ---------------------------------------------------------------------------

function HoursTab() {
  const [loading, setLoading] = useState(true);
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    supabase
      .from("business_hours" as never)
      .select("*")
      .order("day_of_week" as never)
      .order("opens_at" as never)
      .then(({ data, error }) => {
        if (error) toast.error("Failed to load business hours");
        else setHours((data as unknown as BusinessHour[]) ?? []);
        setLoading(false);
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  async function addRow() {
    setSaving(true);
    const { error } = await supabase
      .from("business_hours" as never)
      .insert({ day_of_week: 2, opens_at: "09:00", closes_at: "17:00" } as never);
    if (error) toast.error("Failed to add row");
    else { toast.success("Added"); load(); }
    setSaving(false);
  }

  async function updateRow(id: string, field: string, value: string | number) {
    const { error } = await supabase
      .from("business_hours" as never)
      .update({ [field]: value } as never)
      .eq("id" as never, id as never);
    if (error) toast.error("Failed to update");
    else {
      setHours((prev) => prev.map((h) => (h.id === id ? { ...h, [field]: value } : h)));
    }
  }

  async function deleteRow(id: string) {
    const { error } = await supabase
      .from("business_hours" as never)
      .delete()
      .eq("id" as never, id as never);
    if (error) toast.error("Failed to delete");
    else { setHours((prev) => prev.filter((h) => h.id !== id)); toast.success("Removed"); }
  }

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground max-w-lg">
        Define when the studio accepts bookings. Multiple windows per day are supported (e.g. morning + afternoon with a lunch break).
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-3 pr-4 text-xs uppercase tracking-[0.22em] text-muted-foreground font-normal">Day</th>
              <th className="py-3 pr-4 text-xs uppercase tracking-[0.22em] text-muted-foreground font-normal">Opens</th>
              <th className="py-3 pr-4 text-xs uppercase tracking-[0.22em] text-muted-foreground font-normal">Closes</th>
              <th className="py-3 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {hours.map((h) => (
              <tr key={h.id} className="border-b border-border/60">
                <td className="py-3 pr-4">
                  <select
                    value={h.day_of_week}
                    onChange={(e) => updateRow(h.id, "day_of_week", Number(e.target.value))}
                    className="bg-transparent border border-input rounded-md px-2 py-1.5 text-sm"
                  >
                    {DAY_NAMES.map((name, i) => (
                      <option key={i} value={i}>{name}</option>
                    ))}
                  </select>
                </td>
                <td className="py-3 pr-4">
                  <Input
                    type="time"
                    value={h.opens_at}
                    onChange={(e) => updateRow(h.id, "opens_at", e.target.value)}
                    className="w-32"
                  />
                </td>
                <td className="py-3 pr-4">
                  <Input
                    type="time"
                    value={h.closes_at}
                    onChange={(e) => updateRow(h.id, "closes_at", e.target.value)}
                    className="w-32"
                  />
                </td>
                <td className="py-3">
                  <button
                    onClick={() => deleteRow(h.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addRow}
        disabled={saving}
        className="inline-flex items-center gap-2 border border-border px-6 py-2.5 text-[11px] tracking-[0.28em] uppercase hover:bg-secondary transition-colors disabled:opacity-50"
      >
        <Plus className="size-3.5" />
        Add time window
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Blackout periods tab
// ---------------------------------------------------------------------------

function BlackoutsTab() {
  const [loading, setLoading] = useState(true);
  const [blackouts, setBlackouts] = useState<BlackoutPeriod[]>([]);
  const [saving, setSaving] = useState(false);

  // New blackout form state
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [newReason, setNewReason] = useState("");

  const load = useCallback(() => {
    supabase
      .from("blackout_periods" as never)
      .select("*")
      .order("starts_at" as never, { ascending: false } as never)
      .then(({ data, error }) => {
        if (error) toast.error("Failed to load blackout periods");
        else setBlackouts((data as unknown as BlackoutPeriod[]) ?? []);
        setLoading(false);
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  async function addBlackout() {
    if (!newStart || !newEnd) {
      toast.error("Start and end are required");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("blackout_periods" as never)
      .insert({
        starts_at: new Date(newStart).toISOString(),
        ends_at: new Date(newEnd).toISOString(),
        reason: newReason || null,
      } as never);
    if (error) {
      toast.error("Failed to add blackout period");
    } else {
      toast.success("Blackout period added");
      setNewStart("");
      setNewEnd("");
      setNewReason("");
      load();
    }
    setSaving(false);
  }

  async function deleteBlackout(id: string) {
    const { error } = await supabase
      .from("blackout_periods" as never)
      .delete()
      .eq("id" as never, id as never);
    if (error) toast.error("Failed to delete");
    else {
      setBlackouts((prev) => prev.filter((b) => b.id !== id));
      toast.success("Removed");
    }
  }

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground max-w-lg">
        Block out holidays, training days, or any period you're unavailable. Clients won't see slots during blackout windows.
      </p>

      {/* Add form */}
      <div className="border border-border p-6 max-w-lg space-y-4">
        <p className="eyebrow">Add blackout period</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Starts</label>
            <Input
              type="datetime-local"
              value={newStart}
              onChange={(e) => setNewStart(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Ends</label>
            <Input
              type="datetime-local"
              value={newEnd}
              onChange={(e) => setNewEnd(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Reason (optional)</label>
          <Input
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            placeholder="e.g. Bank holiday, training day"
          />
        </div>
        <button
          onClick={addBlackout}
          disabled={saving}
          className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-2.5 text-[11px] tracking-[0.28em] uppercase text-background hover:bg-transparent hover:text-foreground transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
          Add
        </button>
      </div>

      {/* Existing blackouts */}
      {blackouts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No blackout periods set.</p>
      ) : (
        <div className="space-y-3">
          {blackouts.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between border border-border px-5 py-4"
            >
              <div>
                <p className="text-sm">
                  {format(new Date(b.starts_at), "EEE d MMM yyyy, HH:mm")} –{" "}
                  {format(new Date(b.ends_at), "EEE d MMM yyyy, HH:mm")}
                </p>
                {b.reason && (
                  <p className="mt-1 text-xs text-muted-foreground">{b.reason}</p>
                )}
              </div>
              <button
                onClick={() => deleteBlackout(b.id)}
                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

function LoadingState() {
  return (
    <div className="flex items-center gap-3 py-12 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      Loading...
    </div>
  );
}
