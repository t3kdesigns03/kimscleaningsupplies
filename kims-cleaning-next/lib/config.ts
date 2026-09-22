/* ------------------------------------------------------------------
   Site configuration — the only file Kim needs to touch to turn
   checkout on. See README.md for step-by-step instructions.
   ------------------------------------------------------------------ */

export const config = {
  // 1. PayPal live client ID — developer.paypal.com > Apps & Credentials > Live
  paypalClientId: "REPLACE_ME",
  paypalCurrency: "USD",

  // 2. Venmo — your username WITHOUT the @ sign
  enableVenmo: true,
  venmoHandle: "REPLACE_ME",

  // Optional: paypal.me/YourName (leave "" to hide)
  paypalMe: "",

  // Contact
  contactEmail: "streakfreeks@yahoo.com",
  // Optional Formspree form id. Leave "" to use Netlify Forms + mailto only.
  formspreeId: "",

  // 3. Shipping — flat rate in dollars. Set to 0 to hide the shipping line.
  flatShipping: 8.0,

  pickupLabel: "Pickup — Quincy, IL",
  pickupAddress: "2922 Lincoln Hill SW, Quincy, IL",

  // Canonical production URL — no trailing slash. ONE place to change at
  // cutover: metadataBase, the sitemap, robots.txt and the structured data
  // all read from here. See CUTOVER.md.
  siteUrl: "https://kimscleaningproducts.t3kdesigns.app",

  brand: "Kim's Cleaning Products",
  tagline: "Eco Easy Microfiber · Made in USA",
  town: "Quincy, Illinois",
};

export type SiteConfig = typeof config;
