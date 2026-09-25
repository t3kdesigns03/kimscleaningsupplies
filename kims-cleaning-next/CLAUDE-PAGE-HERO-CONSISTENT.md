# Claude prompt — same hero banner on every page

Live: https://kimscleaningproducts.t3kdesigns.app/

The homepage hero is the spec (circled). Inner pages use a zoomed, ugly crop of the same photo and look lame. Make **one PageHero** and use it everywhere.

## Spec (homepage)

- Short-to-medium dark banner
- Left: title + one line + optional CTAs
- Right: the **whole globe sitting in ferns** (same crop as `/`)
- File: `public/images/brand/hero-globe.jpg` (current home hero). Do not use a different asset or a random `object-position` that turns into leaves-only.

## Use it on every page

| Page | Left content | Height desktop | Height mobile |
|---|---|---|---|
| `/` | Cleans with just water. / Wet it. Wring it. Wipe it. Walk away. / Shop + Tools buttons | ~300–360px | ~420px type first |
| `/shop` | Shop / Ten products. All microfiber. Pickup in Quincy is free. | ~200–240px | ~220px |
| `/about` | Kim and Alice / Eco Easy microfiber, sold face to face… | ~200–240px | ~220px |
| `/events` | Where to find us / demo table line | ~200–240px | ~220px |
| `/contact` | Get in touch / short line | ~200–240px | ~220px |

Same `background-image`, same `background-size` / position so the **sphere stays visible on the right** on every page. Inner pages are just shorter — not a different crop.

Product pages can stay white under the nav so the gallery wins.

## Mobile (required)

- Banner does not eat the whole phone
- Title and subline readable on 360px
- Globe can peek on the right or sit under the type — never cover the words
- Home buttons stay 44px and on-screen without the globe sitting on them
- Header (logo + cart) stays the existing sticky bar. This ticket is the **page banner under the nav**, not a new top bar

## Do not

- Invent a second globe photo
- `object-fit: cover` with a position that only shows ferns (that is the About bug)
- Change cart, PayPal, products
- Bake text into the JPEG

Done when `/`, `/shop`, `/about`, `/events`, `/contact` at 1280 all show the same globe-on-the-right, and 360/390 still read. Push.
