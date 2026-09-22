/* ------------------------------------------------------------------
   Kim's Cleaning Products — site configuration
   This is the only file Kim needs to touch to turn checkout on.
   See README.md for step-by-step instructions.
   ------------------------------------------------------------------ */

window.KIMS_CONFIG = {
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
  formspreeId: "", // optional — paste a Formspree form ID to also POST the contact form

  // 3. Shipping — flat rate in dollars. Set to 0 to hide the shipping line entirely.
  flatShipping: 8.00,

  pickupLabel: "Pickup — Quincy, IL",
  pickupAddress: "2922 Lincoln Hill SW, Quincy, IL",

  brand: "Kim's Cleaning Products",
  tagline: "Eco Easy Microfiber · Made in USA",
  town: "Quincy, Illinois"
};
