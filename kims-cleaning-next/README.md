# Kim's Cleaning Products — Next.js store

Next.js (App Router) + Tailwind, deployed on Netlify. Same shop as the
static version — nine products, localStorage cart, PayPal + Venmo checkout —
rebuilt as a modern component app with the gold-Earth hero.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

`npm run build` then `npm run start` runs the production build.

## Deploy to Netlify

1. Push this branch to GitHub.
2. Netlify → **Add new site → Import from Git** → pick the repo.
3. If this app is in a subfolder (`kims-cleaning-next`), set **Base directory**
   to that folder. Build command `npm run build` and the Next plugin are picked
   up from `netlify.toml` automatically.
4. Deploy. Netlify installs the Next runtime, so `next/image`, the contact form,
   and everything else just work.

## The three things Kim still needs to set

Open **`lib/config.ts`**:

| Setting | What | Where |
|---|---|---|
| `paypalClientId` | Live PayPal client ID | developer.paypal.com → Apps & Credentials → **Live** |
| `venmoHandle` | Venmo username, no `@` | Venmo app → Me |
| `flatShipping` | Flat shipping $, or `0` to hide | your call |

Until PayPal is set, checkout shows a tidy "turns on when connected" panel — the
rest of the site works.

## Editing content

- **Products & prices** — `lib/products.ts`. `images` is an ordered list of
  candidates; missing files are skipped at runtime, so it's safe to list a photo
  before you've added it.
- **Show schedule** — `lib/events.ts` (past dates grey out on their own).
- **Testimonials** — `lib/testimonials.ts`.
- **Colors** — `tailwind.config.ts` (the `colors` block) and the
  `.bg-botanical` gradient in `app/globals.css`.

## Product photos

Real photos aren't in the repo yet — the shop uses brand SVG illustrations so
nothing is ever a broken thumbnail. To pull the originals from the old
Squarespace/Weebly CDN, run a fetch on your machine (see the note in the chat)
and drop the PNGs into `public/images/products/`. The filenames are already
listed in `lib/products.ts`, so they take over on the next build with no code
change.

## Contact form (Netlify Forms)

The form on `/contact` posts to Netlify Forms. Detection works via the hidden
static form at `public/__forms.html` — **don't delete it.** Submissions show up
in the Netlify dashboard under **Forms**. If a submit ever fails (e.g. local
dev), it falls back to opening the visitor's email app. Set `formspreeId` in
`lib/config.ts` to use Formspree instead.

## Structure

```
app/            routes: /, /shop, /product/[slug], /about, /events, /contact, /cart, not-found
components/     Header, Footer, Hero, ProductCard, ProductGallery, ProductBuy,
                CartProvider (cart state), CartView, PayPalCheckout, VenmoBox,
                ContactForm, SmartImage, Toast, Icons
lib/            config, products, events, testimonials, cart types, formatting
public/images/  brand art + product illustrations + the gold-Earth hero
```

Cart is client-side (`localStorage`) via `CartProvider`. PayPal capture is
client-side — fine for a shop this size; PayPal emails the receipt. The Venmo
box is an honest hand-off (it can't confirm payment — Kim checks Venmo).
