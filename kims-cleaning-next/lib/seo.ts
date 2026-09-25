/* ------------------------------------------------------------------
   Search copy in one place: page titles, meta descriptions, the home FAQ,
   and image alt text. Keep the same phrases everywhere — Kim's Cleaning
   Products · Eco Easy Microfiber · Made in USA · water only · 15×15 cloth ·
   pickup in Quincy, Illinois · Iowa and Illinois fairs. Don't add new ones.
   ------------------------------------------------------------------ */

import { config } from "./config";
import { splitEvents } from "./events";
import type { Product } from "./products";

const BRAND = "Kim’s Cleaning Products";
/** "1324 Springdale North, Quincy, IL" — street + town, no ZIP, for meta copy. */
const PICKUP_SHORT = `${config.pickupStreet}, Quincy, IL`;

export const SEO = {
  home: {
    title: `${BRAND} | Microfiber cloths that clean with just water`,
    description:
      "Made in USA Eco Easy microfiber. Wet it, wring it, wipe it, walk away. Cloths, mops, and dusters. Free pickup in Quincy, IL. Iowa and Illinois fairs.",
  },
  shop: {
    title: `Shop Eco Easy microfiber cloths, mops and dusters | ${BRAND}`,
    description:
      "2, 6, and 18-packs, mops, dusters, scrubbies, and hair towels. Water only. Free Quincy pickup.",
  },
  about: {
    title: "Kim and Alice | Eco Easy microfiber from Quincy, IL",
    description: `Kim Schoch and Alice sell Eco Easy microfiber face to face at Iowa and Illinois fairs. Pickup at ${PICKUP_SHORT}.`,
  },
  events: {
    title: `Iowa and Illinois fair schedule | ${BRAND}`,
    description: "Demo table schedule. Bring a dirty window.",
  },
  contact: {
    title: `Pickup in Quincy, IL | ${BRAND}`,
    description: `${config.contactEmail} · ${PICKUP_SHORT} · free pickup at checkout.`,
  },
};

export function productTitle(p: Product): string {
  return `${p.name} | water-only microfiber | ${BRAND}`;
}

/** One sentence from the product blurb + Made in USA + water only.
    Dry-use tools (dust mop, dusters) say "no sprays" — their pages tell
    people not to wet them, so "water only" would contradict the page. */
export function productDescription(p: Product): string {
  const blurb = p.blurb.trim().replace(/\.?$/, ".");
  return `${blurb} Made in USA, ${p.care === "dry" ? "no sprays" : "water only"}.`;
}

/** Product name + "microfiber" + brand — without saying "microfiber" twice. */
export function productAlt(name: string): string {
  return /microfiber/i.test(name) ? `${name} — ${BRAND}` : `${name}, microfiber — ${BRAND}`;
}

/* ---------------- Home FAQ (visible on / and as FAQPage JSON-LD) ---------------- */

export interface Faq {
  q: string;
  a: string;
  link?: { href: string; label: string };
}

export function homeFaqs(now = new Date()): Faq[] {
  const next = splitEvents(now).upcoming[0];
  const weekend = next
    ? `At Iowa and Illinois fairs most weekends from August through December. Next up: ${next.name} in ${next.city}, ${next.state} (${next.date}). The full schedule is on the events page.`
    : "At Iowa and Illinois fairs most weekends from August through December. The full schedule is on the events page.";
  return [
    {
      q: "Can microfiber clean with just water?",
      a: "Yes. The split fiber in the 15×15 cloth lifts dirt and holds it. Water is the only cleaner.",
    },
    {
      q: "Do I need sprays?",
      a: "No. Water only — no sprays, no soap. Wet it, wring it, wipe it, walk away.",
    },
    {
      q: "How do I wash the cloths?",
      a: "In the washer or the dishwasher, with any detergent. No fabric softener — it clogs the fiber. Air dry.",
    },
    {
      q: "Where do I pick up?",
      a: `${PICKUP_SHORT}. Pickup in Quincy, Illinois is free — choose it at checkout.`,
    },
    {
      q: "Where are Kim and Alice this weekend?",
      a: weekend,
      link: { href: "/events", label: "See the fair schedule" },
    },
    {
      q: "Is it made in the USA?",
      a: "Yes. Eco Easy Microfiber is made in USA.",
    },
  ];
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
