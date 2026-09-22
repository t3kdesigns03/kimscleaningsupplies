# Kim's Cleaning Products

A plain HTML/CSS/JS storefront for Kim Schoch and Alice — Eco Easy microfiber cloths,
mops, dusters and hair towels, sold at Iowa and Illinois shows and online. No build
step, no framework, no npm. Open `index.html` in a browser and it works.

Live at: **https://t3kdesigns03.github.io/kimscleaningsupplies/**

---

## The three things Kim still needs to set

Open **`js/config.js`** and replace these:

| Setting | What to put there | Where to get it |
|---|---|---|
| `paypalClientId` | Your **live** PayPal client ID | developer.paypal.com → Apps & Credentials → **Live** tab → your app → Client ID |
| `venmoHandle` | Your Venmo username, **without** the `@` | Venmo app → Me → the name under your picture |
| `flatShipping` | Flat shipping in dollars, e.g. `8.00`. Set `0` to hide the shipping line entirely | Your call |

Until `paypalClientId` is filled in, the checkout page shows a tidy "online checkout turns on
when PayPal is connected" panel instead of a broken button — the rest of the site works fine.
Same for Venmo.

Optional in the same file: `paypalMe`, `formspreeId` (makes the contact form post to
Formspree as well as opening the customer's email app), and `contactEmail`.

---

## Editing the shop

Everything customers read lives in **`js/products.js`**:

- **Prices** — the `price` number on each product.
- **New product** — copy an existing block, give it a new `slug`, add an image to
  `images/products/`, and list that filename in `images`.
- **Hair towel colors** — the `options` list. Set `soldOut: true` on a color to grey it
  out on the product page (Gray is currently out of stock).
- **Show schedule** — `KIMS_EVENTS` at the bottom. Past dates grey themselves out
  automatically, and the home page always shows the next three.
- **Testimonials** — `KIMS_TESTIMONIALS`, also at the bottom.

`images` on each product is a **list of candidates, best first**. Any file that isn't there
is skipped silently, so it's always safe to list a photo you haven't added yet — you'll
never get a broken thumbnail.

---

## Product photos

The site ships with clean SVG illustrations so it looks finished out of the box. The real
product photos from the old Squarespace site are already listed in `js/products.js`; they
just need downloading once.

**Windows:** right-click `tools/get-images.ps1` → *Run with PowerShell*.
**Mac / Linux:** `bash tools/get-images.sh`

Either one drops the PNGs into `images/products/`. Refresh the site and the real photos
take over automatically — no code change needed. Commit them afterwards so they go live.

To use your own photo instead, drop it in `images/products/` and put its filename first in
that product's `images` list. Square photos (1:1) look best; roughly 1200×1200 is plenty.

---

## Turning on GitHub Pages

1. Push this repo to `main`.
2. GitHub → **Settings** → **Pages**.
3. **Source:** Deploy from a branch. **Branch:** `main`, folder `/ (root)`. Save.
4. Give it a minute, then load
   `https://t3kdesigns03.github.io/kimscleaningsupplies/`.

`.nojekyll` is in the repo so GitHub serves every file as-is. Every link and asset path in
the site is relative, so it works both at a domain root and in the `/kimscleaningsupplies/`
subfolder without changes.

**Custom domain later:** add a `CNAME` file containing just the domain, then point the
domain's DNS at GitHub Pages.

---

## Files

```
index.html        Home — hero, how it works, featured, testimonials, next shows
shop.html         All nine products with category filters
product.html      Product detail — reads ?id=slug from the URL
about.html        Kim & Alice, what the fiber is, all testimonials
events.html       Fall schedule, split into upcoming and past
contact.html      Form that writes the email for you
cart.html         Cart, ship-or-pickup, PayPal and Venmo
404.html          Not-found page

css/styles.css    The whole design system. Colours are CSS variables at the top.
js/config.js      ← Kim edits this (PayPal, Venmo, shipping)
js/products.js    ← and this (products, prices, events, testimonials)
js/ui.js          Header and footer, written once and reused on every page
js/cart.js        Cart maths and localStorage
js/paypal.js      PayPal Smart Buttons and the Venmo hand-off
images/products/  Product pictures
images/brand/     Logo mark and photography
tools/            One-off scripts for fetching the old product photos
```

## How checkout actually works

- The cart is stored in the customer's own browser (`localStorage`). No accounts, no
  database, nothing on a server.
- **PayPal** is the real checkout: Smart Buttons with Venmo enabled as a funding source,
  so US customers usually get PayPal, Venmo and card in one place. Capture happens in the
  browser — fine for a shop this size. PayPal emails the customer their receipt.
- **The Venmo box underneath** is a plain hand-off: it shows the amount, a pre-written
  note, and a button that opens the Venmo app. Venmo has no way to tell a website that a
  payment landed, so "I've paid with Venmo" just records the order in that customer's
  browser and tells them Kim will confirm. It is not faking a payment API — check Venmo
  before you ship.
- Customer name, email, phone and address ride along with the PayPal order as the order
  description and `custom_id`, so they show up in Kim's PayPal activity.
- Pickup orders skip shipping and skip the address fields.

## Editing colours

All at the top of `css/styles.css`:

```css
--earth: #2F6B32;   /* the green from the packaging globe — the main brand colour */
--leaf:  #5C9A3A;   /* accent */
--sun:   #E6C200;   /* the packaging yellow, used sparingly */
--cream: #F7F3E8;   /* section backgrounds */
```

## Local preview

Just open `index.html`. If you'd rather serve it (so the URLs look like the live site):

```
python3 -m http.server 8080
```

then visit `http://localhost:8080/`.
