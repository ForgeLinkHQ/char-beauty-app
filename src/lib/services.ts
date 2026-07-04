export type ServiceCategory = "lashes" | "facials" | "peels" | "led" | "tan" | "brows";

export interface Service {
  slug: string;
  category: ServiceCategory;
  name: string;
  tagline: string;
  description: string;
  durationMinutes: number;
  priceGbp: number;
  depositGbp: number;
  requiresPatchTest?: boolean;
  requiresConsultation?: boolean;
}

export const SERVICES: Service[] = [
  // Lashes
  { slug: "classic-lash-set", category: "lashes", name: "Classic Lash Set", tagline: "One extension per natural lash", description: "A refined, mascara-effect look with one lightweight extension applied to each natural lash. Ideal for a first set or an everyday polish.", durationMinutes: 120, priceGbp: 85, depositGbp: 20, requiresPatchTest: true },
  { slug: "hybrid-lash-set", category: "lashes", name: "Hybrid Lash Set", tagline: "A blend of classic and volume", description: "A soft, textured mix of classic singles and lightweight fans. Fluffier than classic, softer than volume.", durationMinutes: 150, priceGbp: 105, depositGbp: 25, requiresPatchTest: true },
  { slug: "volume-lash-set", category: "lashes", name: "Volume Lash Set", tagline: "Handmade fans for density", description: "Bespoke handmade fans of 2–6 ultra-fine extensions per natural lash, mapped to your eye shape.", durationMinutes: 180, priceGbp: 130, depositGbp: 30, requiresPatchTest: true, requiresConsultation: true },
  { slug: "mega-volume", category: "lashes", name: "Mega Volume", tagline: "Full, editorial density", description: "The most dramatic finish — 10–16 ultra-fine fans per lash, handmade in the moment.", durationMinutes: 210, priceGbp: 160, depositGbp: 40, requiresPatchTest: true, requiresConsultation: true },
  { slug: "lash-infill-2-3wk", category: "lashes", name: "Infill · 2–3 weeks", tagline: "Keep the set looking fresh", description: "Top-up appointment for existing sets from C. Beauty. Please book within three weeks of your last visit.", durationMinutes: 75, priceGbp: 55, depositGbp: 15 },
  { slug: "lash-removal", category: "lashes", name: "Lash Removal", tagline: "Gentle, cream-based", description: "Careful removal of any existing extensions with a nourishing cream remover.", durationMinutes: 30, priceGbp: 20, depositGbp: 10 },

  // Facials
  { slug: "signature-facial", category: "facials", name: "Signature Facial", tagline: "Deep cleanse, mask, massage", description: "A 60-minute results-led facial tailored to your skin on the day — cleanse, exfoliation, mask, LED, massage.", durationMinutes: 60, priceGbp: 70, depositGbp: 15 },
  { slug: "glow-facial", category: "facials", name: "The Glow Facial", tagline: "Event-ready radiance", description: "A brightening facial with enzymatic exfoliation, lymphatic massage and LED for immediate luminosity.", durationMinutes: 75, priceGbp: 90, depositGbp: 20 },

  // Peels
  { slug: "gentle-peel", category: "peels", name: "Gentle Chemical Peel", tagline: "Mandelic + lactic", description: "A low-strength peel to refresh texture and tone with minimal downtime. Consultation required before first booking.", durationMinutes: 45, priceGbp: 75, depositGbp: 20, requiresConsultation: true, requiresPatchTest: true },
  { slug: "advanced-peel", category: "peels", name: "Advanced Peel", tagline: "For pigmentation & texture", description: "A stronger blend addressing pigmentation, congestion and fine lines. Suitable after a course-planning consultation.", durationMinutes: 60, priceGbp: 110, depositGbp: 30, requiresConsultation: true, requiresPatchTest: true },

  // LED
  { slug: "led-therapy", category: "led", name: "LED Light Therapy", tagline: "Calming, reparative", description: "A 30-minute stand-alone LED session — red for repair, blue for blemish-prone skin, near-infrared for calm.", durationMinutes: 30, priceGbp: 35, depositGbp: 10 },

  // Tan
  { slug: "spray-tan", category: "tan", name: "Spray Tan", tagline: "Custom-mixed, streak-free", description: "A custom-mixed spray tan in your ideal depth, applied by hand for a natural, even finish.", durationMinutes: 30, priceGbp: 35, depositGbp: 10 },

  // Brows
  { slug: "brow-wax-shape", category: "brows", name: "Brow Wax & Shape", tagline: "Considered, editorial", description: "Bespoke shaping with wax and precision tweezing to enhance your natural brow.", durationMinutes: 30, priceGbp: 25, depositGbp: 10 },
];

export const CATEGORY_LABEL: Record<ServiceCategory, string> = {
  lashes: "Lash Extensions",
  facials: "Facials",
  peels: "Chemical Peels",
  led: "LED Light Therapy",
  tan: "Spray Tanning",
  brows: "Brows",
};

export const CATEGORY_ORDER: ServiceCategory[] = ["lashes", "facials", "peels", "led", "tan", "brows"];

export function formatGbp(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
}

export function formatDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}
