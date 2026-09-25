# Claude prompt — SEO pass + admin delete

Live: https://kimscleaningproducts.com/
App: `kims-cleaning-next/`

Two jobs only. No redesign. No PayPal work.

## A. SEO / AI (one pass)

There is no meta description and no FAQ. Add them.

Keep these phrases consistent on every page:
Kim’s Cleaning Products · Eco Easy Microfiber · Made in USA · water only · 15×15 cloth · pickup in Quincy, Illinois · Iowa and Illinois fairs.

### Titles + meta (unique per route)

`/`  
Title: Kim’s Cleaning Products | Microfiber cloths that clean with just water  
Meta: Made in USA Eco Easy microfiber. Wet it, wring it, wipe it, walk away. Cloths, mops, and dusters. Free pickup in Quincy, IL. Iowa and Illinois fairs.

`/shop`  
Title: Shop Eco Easy microfiber cloths, mops and dusters | Kim’s Cleaning Products  
Meta: 2, 6, and 18-packs, mops, dusters, scrubbies, and hair towels. Water only. Free Quincy pickup.

Product pages  
Title: {Product name} | water-only microfiber | Kim’s Cleaning Products  
Meta: one sentence from the existing product blurb + Made in USA + water only.

`/about`  
Title: Kim and Alice | Eco Easy microfiber from Quincy, IL  
Meta: Kim Schoch and Alice sell Eco Easy microfiber face to face at Iowa and Illinois fairs. Pickup at 2922 Lincoln Hill SW, Quincy, IL.

`/events`  
Title: Iowa and Illinois fair schedule | Kim’s Cleaning Products  
Meta: Demo table schedule. Bring a dirty window.

`/contact`  
Title: Pickup in Quincy, IL | Kim’s Cleaning Products  
Meta: streakfreeks@yahoo.com · 2922 Lincoln Hill SW, Quincy, IL · free pickup at checkout.

Footer NAP on every public page: Kim’s Cleaning Products · Quincy, Illinois · streakfreeks@yahoo.com

### Home FAQ (visible + FAQPage JSON-LD)

1. Can microfiber clean with just water? Yes. Split fiber lifts dirt. Water is the only cleaner.
2. Do I need sprays? No.
3. How do I wash the cloths? Washer or dishwasher. No fabric softener.
4. Where do I pick up? 2922 Lincoln Hill SW, Quincy, IL. Free at checkout.
5. Where are Kim and Alice this weekend? See /events.
6. Is it made in the USA? Yes.

Also Organization + LocalBusiness JSON-LD on the home layout (name, url https://kimscleaningproducts.com, email, address Quincy). Product JSON-LD only if cheap — skip if it fights the cart.

Image alts: product name + “microfiber” + “Kim’s Cleaning Products”. No keyword stuffing.

Do not add a blog. Do not put `/admin` in sitemap.

## B. Admin delete

`/admin` ticket: add **Delete order**.

Click → modal: “Delete this order? This cannot be undone.” Buttons: Cancel / Delete order.

Confirm → DELETE (or status archive) that row in Supabase via the existing service-role admin API. Row disappears. Print list ignores it.

Do not allow delete from the public site. Keep the confirm. Phone-sized modal.

## Do not

- Restyle the store or admin header
- Change PayPal
- Invent new keywords beyond the titles above

Push when view-source on `/` shows meta + FAQ JSON-LD, and `/admin` can delete a test order after confirm.
