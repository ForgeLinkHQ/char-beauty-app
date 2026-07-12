import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { ArrowLeft, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { SERVICES, formatGbp, formatDuration, type Service } from "@/lib/services";
import {
  getAvailableSlots,
  reserveSlot,
  reserveInputSchema,
  type ReserveInput,
  type Reservation,
  BookingError,
} from "@/lib/booking-api";
import { CATEGORY_LABEL, CATEGORY_ORDER } from "@/lib/services";

// ---------------------------------------------------------------------------
// Wizard state
// ---------------------------------------------------------------------------

type WizardStep = "service" | "date" | "time" | "details" | "confirmed";

const STEP_NUMBER: Record<WizardStep, number> = {
  service: 1,
  date: 2,
  time: 3,
  details: 4,
  confirmed: 5,
};

const STEP_LABEL: Record<WizardStep, string> = {
  service: "Choose your service",
  date: "Pick a date",
  time: "Pick a time",
  details: "Your details",
  confirmed: "You're booked in",
};

// ---------------------------------------------------------------------------
// Main wizard
// ---------------------------------------------------------------------------

export function BookingWizard({ initialSlug }: { initialSlug?: string }) {
  const [step, setStep] = useState<WizardStep>(initialSlug ? "date" : "service");
  const [service, setService] = useState<Service | undefined>(
    SERVICES.find((s) => s.slug === initialSlug),
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>();
  const [reservation, setReservation] = useState<Reservation | undefined>();

  const goBack = useCallback(() => {
    const order: WizardStep[] = ["service", "date", "time", "details"];
    const idx = order.indexOf(step);
    if (idx > 0) {
      if (step === "time") setSelectedSlot(undefined);
      setStep(order[idx - 1]);
    }
  }, [step]);

  function selectService(s: Service) {
    setService(s);
    setSelectedDate(undefined);
    setSelectedSlot(undefined);
    setStep("date");
  }

  function selectDate(d: Date) {
    setSelectedDate(d);
    setSelectedSlot(undefined);
    setStep("time");
  }

  function selectSlot(slot: string) {
    setSelectedSlot(slot);
    setStep("details");
  }

  function handleReserved(r: Reservation) {
    setReservation(r);
    setStep("confirmed");
  }

  return (
    <>
      {/* Progress bar */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-14 lg:px-10 lg:pt-24 lg:pb-20">
          <div className="flex items-center gap-4">
            {step !== "service" && step !== "confirmed" && (
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                Back
              </button>
            )}
            <p className="eyebrow">
              Book {step !== "confirmed" ? `· Step ${STEP_NUMBER[step]} of 4` : "· Confirmed"}
            </p>
          </div>
          <h1 className="mt-6 text-5xl md:text-6xl">{STEP_LABEL[step]}</h1>

          {/* Context strip */}
          {service && step !== "service" && (
            <div className="mt-8 inline-flex flex-wrap items-center gap-3 border border-accent/30 bg-accent/5 px-5 py-3 text-xs uppercase tracking-[0.22em]">
              <strong className="font-medium">{service.name}</strong>
              <span className="text-muted-foreground">·</span>
              <span>{formatDuration(service.durationMinutes)}</span>
              <span className="text-muted-foreground">·</span>
              <span>{formatGbp(service.priceGbp)}</span>
              {selectedDate && step !== "date" && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span>{format(selectedDate, "EEE d MMM")}</span>
                </>
              )}
              {selectedSlot && step !== "time" && step !== "date" && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span>{format(new Date(selectedSlot), "HH:mm")}</span>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Step content */}
      {step === "service" && <StepService selected={service} onSelect={selectService} />}
      {step === "date" && service && <StepDate service={service} onSelect={selectDate} selected={selectedDate} />}
      {step === "time" && service && selectedDate && (
        <StepTime service={service} date={selectedDate} onSelect={selectSlot} />
      )}
      {step === "details" && service && selectedSlot && (
        <StepDetails service={service} slot={selectedSlot} onReserved={handleReserved} />
      )}
      {step === "confirmed" && reservation && service && (
        <StepConfirmed reservation={reservation} service={service} />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 1: Service selection
// ---------------------------------------------------------------------------

function StepService({
  selected,
  onSelect,
}: {
  selected?: Service;
  onSelect: (s: Service) => void;
}) {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-10">
          <p className="text-sm text-muted-foreground">
            Pick the treatment you'd like. On the next step you'll see live availability and secure
            the slot with a small card deposit that comes off your total.
          </p>
        </div>
      </section>

      {CATEGORY_ORDER.map((cat) => {
        const items = SERVICES.filter((s) => s.category === cat);
        return (
          <section key={cat} className="border-b border-border last:border-0">
            <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                <div className="md:col-span-4">
                  <p className="eyebrow">Category</p>
                  <h2 className="mt-3 font-serif text-2xl">{CATEGORY_LABEL[cat]}</h2>
                </div>
                <div className="md:col-span-8">
                  <ul className="divide-y divide-border">
                    {items.map((s) => {
                      const isSelected = s.slug === selected?.slug;
                      return (
                        <li key={s.slug} className="py-5">
                          <button
                            onClick={() => onSelect(s)}
                            className="group flex w-full items-baseline justify-between gap-6 text-left"
                          >
                            <div>
                              <h3
                                className={`font-serif text-lg ${isSelected ? "text-accent" : "group-hover:text-accent transition-colors"}`}
                              >
                                {s.name}
                              </h3>
                              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                                {formatDuration(s.durationMinutes)} · Deposit{" "}
                                {formatGbp(s.depositGbp)}
                                {s.requiresPatchTest && " · Patch test 48h"}
                                {s.requiresConsultation && " · Consultation"}
                              </p>
                            </div>
                            <span className="whitespace-nowrap text-sm">
                              {formatGbp(s.priceGbp)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 2: Date picker
// ---------------------------------------------------------------------------

function StepDate({
  service,
  onSelect,
  selected,
}: {
  service: Service;
  onSelect: (d: Date) => void;
  selected?: Date;
}) {
  const today = startOfDay(new Date());
  const maxDate = addDays(today, 60);

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">Availability</p>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Choose a date to see available time slots. The studio is open Tuesday to Saturday.
            </p>
            {service.requiresPatchTest && (
              <p className="mt-4 text-xs text-accent leading-relaxed">
                This treatment requires a patch test at least 48 hours before your appointment.
                First-time clients should allow extra lead time.
              </p>
            )}
          </div>
          <div className="md:col-span-8 flex justify-center">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={(d) => d && onSelect(d)}
              disabled={(d) =>
                isBefore(d, today) ||
                d > maxDate ||
                d.getDay() === 0 ||
                d.getDay() === 1
              }
              fromDate={today}
              toDate={maxDate}
              className="[--cell-size:2.75rem]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Step 3: Time slot picker
// ---------------------------------------------------------------------------

function StepTime({
  service,
  date,
  onSelect,
}: {
  service: Service;
  date: Date;
  onSelect: (slot: string) => void;
}) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const day = format(date, "yyyy-MM-dd");
    getAvailableSlots(service.slug, day)
      .then((result) => {
        if (!cancelled) {
          setSlots(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof BookingError ? err.message : "Failed to load availability.");
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [service.slug, date]);

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">Time slots</p>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Showing availability for {format(date, "EEEE d MMMM yyyy")}.
              Each slot includes your full {formatDuration(service.durationMinutes)} appointment.
            </p>
          </div>
          <div className="md:col-span-8">
            {loading && (
              <div className="flex items-center gap-3 py-12 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading available times...
              </div>
            )}

            {error && (
              <div className="py-12 text-sm text-destructive">{error}</div>
            )}

            {!loading && !error && slots.length === 0 && (
              <div className="py-12 text-sm text-muted-foreground">
                No slots available on this date. Please go back and try another day.
              </div>
            )}

            {!loading && !error && slots.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => onSelect(slot)}
                    className="group flex items-center justify-center gap-2 border border-border px-4 py-3 text-sm hover:border-accent hover:text-accent transition-colors"
                  >
                    <Clock className="size-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
                    {format(new Date(slot), "HH:mm")}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Step 4: Client details form
// ---------------------------------------------------------------------------

function StepDetails({
  service,
  slot,
  onReserved,
}: {
  service: Service;
  slot: string;
  onReserved: (r: Reservation) => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReserveInput>({
    resolver: zodResolver(reserveInputSchema),
    defaultValues: {
      serviceSlug: service.slug,
      startsAt: slot,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      marketingConsent: false,
      notes: "",
    },
  });

  const marketingConsent = watch("marketingConsent");

  async function onSubmit(data: ReserveInput) {
    setSubmitting(true);
    try {
      const result = await reserveSlot(data);
      onReserved(result);
    } catch (err) {
      const message =
        err instanceof BookingError
          ? err.message
          : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">Almost there</p>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Enter your details below. Your slot will be held for 15 minutes while you
              complete the deposit.
            </p>
            <div className="mt-6 space-y-2 text-xs text-muted-foreground">
              <p>Deposit: {formatGbp(service.depositGbp)} (deducted from the total)</p>
              <p>Balance due on the day: {formatGbp(service.priceGbp - service.depositGbp)}</p>
            </div>
          </div>
          <div className="md:col-span-8 max-w-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <input type="hidden" {...register("serviceSlug")} />
              <input type="hidden" {...register("startsAt")} />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="eyebrow mb-2 block">First name</label>
                  <Input {...register("firstName")} autoComplete="given-name" />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-destructive">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="eyebrow mb-2 block">Last name</label>
                  <Input {...register("lastName")} autoComplete="family-name" />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="eyebrow mb-2 block">Email</label>
                <Input type="email" {...register("email")} autoComplete="email" />
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="eyebrow mb-2 block">
                  Phone <span className="normal-case tracking-normal text-muted-foreground">(optional)</span>
                </label>
                <Input type="tel" {...register("phone")} autoComplete="tel" />
                {errors.phone && (
                  <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="eyebrow mb-2 block">
                  Notes <span className="normal-case tracking-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  {...register("notes")}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Anything we should know — allergies, lash style preferences, etc."
                />
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="marketing"
                  checked={marketingConsent}
                  onCheckedChange={(v) => setValue("marketingConsent", v === true)}
                />
                <label htmlFor="marketing" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                  Send me offers, new treatment launches and studio updates. You can unsubscribe
                  any time.
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 border border-foreground bg-foreground px-8 py-3.5 text-[11px] tracking-[0.28em] uppercase text-background hover:bg-transparent hover:text-foreground transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Reserving...
                  </>
                ) : (
                  `Reserve · ${formatGbp(service.depositGbp)} deposit`
                )}
              </button>

              <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                By reserving you agree to our{" "}
                <Link to="/legal/terms" className="underline">
                  terms
                </Link>{" "}
                and{" "}
                <Link to="/legal/privacy" className="underline">
                  privacy policy
                </Link>
                . The deposit is non-refundable for no-shows.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Step 5: Confirmation
// ---------------------------------------------------------------------------

function StepConfirmed({
  reservation,
  service,
}: {
  reservation: Reservation;
  service: Service;
}) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function tick() {
      const diff = new Date(reservation.holdExpiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("expired");
        return;
      }
      const m = Math.floor(diff / 60_000);
      const s = Math.floor((diff % 60_000) / 1000);
      setTimeLeft(`${m}:${s.toString().padStart(2, "0")}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [reservation.holdExpiresAt]);

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-accent" />
              <p className="eyebrow">Slot held</p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Your slot is reserved. Complete the deposit payment to confirm your booking.
            </p>
            {timeLeft !== "expired" ? (
              <p className="mt-4 text-sm">
                Hold expires in{" "}
                <span className="font-mono font-medium text-accent">{timeLeft}</span>
              </p>
            ) : (
              <p className="mt-4 text-sm text-destructive">
                Your hold has expired. Please start again to book.
              </p>
            )}
          </div>
          <div className="md:col-span-8 max-w-lg">
            <div className="divide-y divide-border border border-border">
              <div className="flex justify-between px-5 py-4">
                <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Service</span>
                <span className="text-sm font-medium">{reservation.serviceName}</span>
              </div>
              <div className="flex justify-between px-5 py-4">
                <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Date</span>
                <span className="text-sm">{format(new Date(reservation.startsAt), "EEEE d MMMM yyyy")}</span>
              </div>
              <div className="flex justify-between px-5 py-4">
                <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Time</span>
                <span className="text-sm">
                  {format(new Date(reservation.startsAt), "HH:mm")} – {format(new Date(reservation.endsAt), "HH:mm")}
                </span>
              </div>
              <div className="flex justify-between px-5 py-4">
                <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Total</span>
                <span className="text-sm">{formatGbp(reservation.priceGbp)}</span>
              </div>
              <div className="flex justify-between px-5 py-4">
                <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Deposit now</span>
                <span className="text-sm font-medium text-accent">{formatGbp(reservation.depositGbp)}</span>
              </div>
              <div className="flex justify-between px-5 py-4">
                <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Balance on the day</span>
                <span className="text-sm">{formatGbp(reservation.priceGbp - reservation.depositGbp)}</span>
              </div>
              {reservation.requiresPatchTest && (
                <div className="px-5 py-4">
                  <p className="text-xs text-accent leading-relaxed">
                    A patch test is required at least 48 hours before this treatment. We'll be in
                    touch to arrange this.
                  </p>
                </div>
              )}
            </div>

            {/* Stripe checkout placeholder */}
            <div className="mt-8 border border-dashed border-accent/40 bg-accent/5 px-5 py-6 text-center">
              <p className="eyebrow">Deposit checkout</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Stripe checkout integration coming in the next build step. Your slot is held —
                payment must be completed within the hold window.
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-[11px] uppercase tracking-[0.28em] border-b border-foreground pb-0.5 hover:text-accent hover:border-accent transition-colors"
              >
                Return home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
