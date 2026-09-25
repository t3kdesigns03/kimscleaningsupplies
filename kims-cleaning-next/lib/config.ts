/* ------------------------------------------------------------------
   Site configuration — the only file Kim needs to touch to turn
   checkout on. See README.md for step-by-step instructions.
   ------------------------------------------------------------------ */

export const config = {
  // 1. PayPal live client ID — developer.paypal.com > Apps & Credentials > Live
  // Set NEXT_PUBLIC_PAYPAL_CLIENT_ID in Netlify. Empty = PayPal buttons are
  // hidden and checkout still works for pickup and shows (pay in person).
  paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
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
  // Split so the contact page can stack it on two lines. `pickupAddress`
  // below joins them — change the address HERE and nowhere else.
  pickupStreet: "1324 Springdale North",
  pickupCityState: "Quincy, IL 62305",

  // Canonical production URL — no trailing slash. ONE place to change at
  // cutover: metadataBase, the sitemap, robots.txt and the structured data
  // all read from here. See CUTOVER.md.
  siteUrl: "https://kimscleaningproducts.com",

  brand: "Kim's Cleaning Products",
  tagline: "Eco Easy Microfiber · Made in USA",
  town: "Quincy, Illinois",
};

/** One-line postal address, e.g. for the footer and the cart. */
export const pickupAddress = `${config.pickupStreet}, ${config.pickupCityState}`;

export type SiteConfig = typeof config;
