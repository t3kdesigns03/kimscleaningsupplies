# Claude prompt — mobile products: no sideways scroll

Live: https://kimscleaningproducts.com/
Phone check at 360 and 390.

The homepage cloths/tools rows are still a Koala-style horizontal snap. Cards are ~345px so the next product is off-screen. Shop tiles are enormous. Filter chips clip “Hair”. How-it-works step 3 reads “One pass. No circles. No”.

## Do this

**Home `/` — “Start with the cloths” and “Mops, dusters, and the hair towel”**
- Under 768px: kill `overflow-x` / snap carousel.
- One column, full width minus page gutter (~16–20px).
- Product image max-height ~200–220px, `object-contain` on white. Not a square that eats the phone.
- Title, price, Add all visible without swiping sideways.
- Desktop ≥768 can stay a 3-up grid. Not a side-scroll.

**Shop `/shop`**
- Under 768px: single column. Image area ~200–220px tall, contain, not a 400px poster.
- Filter chips wrap or scroll the *chips only* — never the product grid. “Hair” must be reachable.
- No page-level horizontal scroll (`document` width === viewport).

**How-it-works**
- Step copy cannot clip. Stack 1–4 in one column under 480px if the 2×2 grid truncates “Wipe it”.

**Header**
- Leave the hamburger | mark | cart bar alone unless the wordmark overflows at 360. Then `clamp` type only.

## Do not

- Change desktop 1280 layout except dropping home side-scroll
- Touch PayPal, cart logic, photos files
- Add a “swipe for more” hint

Done when 360/390 screenshots of `/` and `/shop` show every product card fully on screen, no horizontal page swipe. Push.
