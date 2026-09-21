# OPUS 4.8 — Kim’s Cleaning Supplies visual revamp

Paste into Claude Code.

```
E:\T3KDesigns\KimsCleaningSupplies\kims-cleaning-next
```

Repo: https://github.com/t3kdesigns03/kimscleaningsupplies  
Branch: `next-migration` only  
Live: https://kimscleaningsupplies.t3kdesigns.app/  
This is the Next.js app. Do not touch repo-root static HTML.

Open these and steal *craft*, not colors or logos:

- https://www.koalaeco.com/ — header, hero composition, white-ground product tiles, quiet eco luxury
- https://mintcleaningproducts.com/ — lifestyle calm, real kitchen, one Shop
- https://www.makersclean.com/ — cloths + tools merch, in-use hero energy, category bar

Kim keeps her own identity: earth green, globe, “Cleans with just water.”

---

## Who this is for

Kim Schoch and Alice. Midwest fair / home-show vendors. Last designer left them with a broken Squarespace. This site is how they look at the booth and how they take money between shows. Pretty and shoppable. Events matter. Orders from the site should work (PayPal + Venmo already exist — do not break them).

Not a subscription brand. No accounts. No “subscribe and save.” No first-load email popup.

---

## Do not change

- Logo / wordmark. Same “Kim’s Cleaning Supplies” + Eco Easy Microfiber. No new mark in this pass.
- Palette: earth `#2F6B32`, earth-dark `#1E4A22`, leaf `#5C9A3A`, wash `#E7F4C8`, cream `#F7F3E8`, paper white, packaging yellow `#E6C200`.
- Product names, prices, slugs, hair-towel colors, events data, PayPal/Venmo, pickup in Quincy.
- Stack: Next + Tailwind already in this folder.

---

## The look

Koala structure in Kim’s green.

**Promo bar (new).** Thin earth or leaf bar above the header. Rotate or cycle short lines. Pick from:

- Next fair from the events list (name + city)
- Free pickup in Quincy
- Made in USA · water only
- See us at Iowa & Illinois shows

This is the “announcement bar” those three sites have. Events are the announcement.

**Header.**  
Mobile (<768): `hamburger | wordmark | cart`. Centered name. Subline hidden. Type small enough that “Kim’s Cleaning Supplies” never hits the bag. Opaque cream bar, z-index above the hero. 56–64px tall. 44px tap targets.

Desktop: optional promo bar + cream header, wordmark left or centered (Koala-centered is preferred), Shop About Events Contact, cart. No overlap.

**Hero.** Globe-only full bleed — the existing earth graphic. Compose like Koala, not like a two-column brochure:

- Eyebrow chip: Eco Easy Microfiber · Made in USA
- H1: Cleans with just water.
- Sub: Wet it. Wring it. Wipe it. Walk away.
- One lime Shop the cloths + ghost See the tools
- Proof chips under

Mobile: globe crops behind the type. Header does not sit on top of the headline.

**Home merch.** After the fair ticker:

1. “Start with the cloths” — 2 / 6 / 18 as large white-ground tiles, real photos, price, add. Horizontal scroll on mobile like Koala’s bottles.
2. “The tools” — mop, mop head, dusters, hair towel. Same card.
3. How-it-works as editorial (big type + one photo if we have one), not four generic icon cards with a computer-monitor “wipe.”
4. Testimonials if data already exists.
5. Next shows.

**Shop.** Same cards as home. Filters stay (All / Cloths / Mops / Dusters / Hair). White ground. Real photos first.

**Product page.** Gallery of real photos, zoom or large swipe on mobile. Sticky add bar on mobile (price + Add). Pack comparison for cloths stays.

**Cart / checkout.** Keep PayPal + Venmo + pickup vs ship. Make the page match the new chrome. Drawer cart is fine (Koala/Mint).

---

## Photos — this is the merch pass

New actual photos live in `public/images/products/`. Crawl that folder.

In `lib/products.ts` (or wherever `images[]` is), **every product’s first image must be a raster** (`.png` / `.jpg` / `.webp`). SVG clipart (`cloths-2.svg`, `mop-head.svg`, etc.) goes last as fallback only.

Known rasters already referenced (put these first when the file exists):

- cloths: `3WE6ZFHZ6L3CZCJ5ADX3BIEV.png`, `V7KMXPSLGQLGOUUUODTY4CCT.png`, `FCECSWD3IWVIL2JEHUPIU3TD.png`, `HC7I2N6D6JKVRNEZ23RJFP3H.png`
- mops: `4EK5OKNWSGAVNIT6IBLVE3WH.png`, `MNF2D7WSEOHZVSSTYYJYV7MH.png`
- dusters: `A5ATN4JPJJTKB4DQ6JN2RB5O.png`, `64NIUDQLZU4JRFFW6BYDZAFV.png`, `SVNVXTDAXJJ5GE4MLVIO3B3P.png`, `ULZJVS362RKARQVRIEXAHGYC.png`, `QNVEEZAQVYGZJ5M4YW6UHQNE.png`
- hair: `B4JFA4NLXALZ2332BWL6TGEW.png`, `QD5PPQDRZV6HTAFM6QXVLAI4.png`

Also use any new jpg/png the owner added to that folder (including names like `1200.jpg`). If a photo has a busy background, CSS it onto white (`object-contain` on `#fff`). Do not generate new cartoon packs.

Shop cards today show yellow clipart boxes. That is the thing that makes this look like a first draft. Kill it.

---

## Interactive extras (do these)

- Cart drawer from the bag icon
- Quick-add on product cards
- Sticky mobile ATC on product pages
- Fair ticker pauses on hover/touch
- Product image zoom or simple lightbox
- Hover lift on desktop cards

Do not add: search, accounts, subscribe, email-gate popup, extra frameworks.

---

## Done when

1. 360 / 375 / 390 / 414: header title and cart do not overlap. Hamburger left, name center, bag right.
2. Homepage at 1280 looks like a small Koala/Maker’s cousin: promo bar, globe hero, real product tiles on white, fair ticker.
3. Shop does not lead with clipart packs.
4. PayPal / Venmo / pickup still work.
5. Events still have a home presence and a full page.
6. Commit and push `next-migration`.

Look at Koala for 60 seconds on your phone. Then fix Header, product image order, and the home/shop cards. That is 80% of this pass.
