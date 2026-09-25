# Cutover runbook — Squarespace → Netlify

Everything needed to move Kim's Cleaning Products off Squarespace without
dropping the search rankings the old domain has accumulated.

**Status:** not cut over. Redirect rules are written and committed
(`kims-cleaning-next/public/_redirects`) but inert until DNS points at Netlify.

---

## 1. Where things stand

| | Today | After cutover |
|---|---|---|
| Live storefront | `www.kimseco-ezmicrofibers.com` (Squarespace) | Netlify |
| Preview | `kimscleaningsupplies.t3kdesigns.app` | `kimscleaningproducts.t3kdesigns.app` |
| Repo / branch | `t3kdesigns03/kimscleaningsupplies`, `next-migration` | same |
| Stack | Squarespace | Next.js App Router + Tailwind, `kims-cleaning-next/` |
| DNS | Porkbun | Porkbun |

The brand is now **Kim's Cleaning Products** everywhere a customer can see it.
"Supplies" survives only in internal identifiers — repo name, npm package name,
the local folder, the old Netlify subdomain. Section 6 covers those.

---

## 2. The redirect map

Old paths come from the live Squarespace sitemap
(`https://www.kimseco-ezmicrofibers.com/sitemap.xml`, pulled 21 Sep 2026).
All fifteen URLs are accounted for. Every rule is a **301** — a 302 tells
Google the move is temporary and holds the ranking signal on the dead URL.

### Pages

| Squarespace | New | Note |
|---|---|---|
| `/` | `/` | unchanged — **no rule** |
| `/about` | `/about` | unchanged — **no rule** |
| `/calendar-of-events` | `/events` | renamed |
| `/contact-us` | `/contact` | renamed |
| `/testimonials` | `/about#testimonials` | folded into About |
| `/s/shop` | `/shop` | Squarespace `/s/` prefix dropped |

### Products

Squarespace used `/product/<slugified-name>/<numeric-id>`. The new site uses a
clean single-segment slug.

| Squarespace | New |
|---|---|
| `/product/kim-s-cleaning-cloths-qty-2/2` | `/product/cloth-2` |
| `/product/kim-s-cleaning-cloths-qty-6/3` | `/product/cloth-6` |
| `/product/kim-s-cleaning-cloths-qty-18/4` | `/product/cloth-18` |
| `/product/grandma-s-dry-dust-mop/1` | `/product/grandma-mop` |
| `/product/microfiber-mop-head/5` | `/product/scrubbies` (the old "Mop Head" listing was the scrubbies photo, mislabeled) |
| `/product/microfiber-high-duster/6` | `/product/high-duster` |
| `/product/microfiber-hand-duster/7` | `/product/hand-duster` |
| `/product/kim-s-hair-towel/8` | `/product/hair-towel` |
| `/product/microfiber-fluffy-duster/10` | `/product/fluffy-duster` |

### Paths that did not change

`/` and `/about` keep their paths, so they get **no rule at all**. A redirect
whose source equals its destination is an infinite loop, not a no-op: Netlify
serves it as `ERR_TOO_MANY_REDIRECTS`. This shipped once and took the live
About page down. `npm run check:redirects` now fails the build on it.

### Safety nets

`/s/*` and `/product/:slug/:id` both fall back to `/shop`, so any Squarespace
URL that was never in the sitemap (an old share link, a printed QR code) lands
somewhere useful instead of a 404.

The product net is deliberately **two segments**. A bare `/product/*` splat
would also swallow the new `/product/cloth-2` routes, because Netlify evaluates
user redirects before handing off to the Next.js handler. Do not "simplify" it.

---

## 3. Cutover steps

Do these in order. Steps 1–3 are reversible; step 4 is the switch.

1. **Netlify: add the custom domain.** Site settings → Domain management → add
   `kimseco-ezmicrofibers.com` and `www.kimseco-ezmicrofibers.com`. Netlify will
   report DNS as unverified — expected until step 4.
2. **Pick the canonical host** (`www` or apex) and set the other to redirect to
   it in Netlify. Squarespace served `www`, so staying on `www` is one fewer
   redirect hop and one fewer thing to get wrong.
3. **Update `siteUrl`** in `kims-cleaning-next/lib/config.ts` to the canonical
   production URL — one line, no trailing slash. It currently reads
   `https://kimscleaningproducts.t3kdesigns.app`. `metadataBase`, the sitemap,
   robots.txt and every structured-data URL all derive from it, so this is the
   only place the domain is written down. Get it wrong and Google treats the
   preview subdomain as the real site.
4. **Porkbun DNS.** Point the records at Netlify, then wait out TTL:
   - `www` → CNAME → `<site-name>.netlify.app`
   - apex → ALIAS/ANAME → `<site-name>.netlify.app` (Porkbun supports ALIAS; do
     not use an A record unless Netlify gives you a specific IP)
   - Lower the TTL to 300s a day *before* the switch so a mistake costs minutes
     instead of hours.
5. **Wait for the Let's Encrypt cert** to provision in Netlify (usually minutes
   after DNS resolves). Do not announce the move until HTTPS is green.
6. **Cancel Squarespace** only after section 4 passes. While the subscription is
   live you can always point DNS back.

---

## 4. Verify before you announce

Run this once DNS has propagated. Every line must print `301`, then the new URL.

```bash
for p in /about /calendar-of-events /contact-us /testimonials /s/shop \
         /product/kim-s-cleaning-cloths-qty-2/2 \
         /product/kim-s-cleaning-cloths-qty-6/3 \
         /product/kim-s-cleaning-cloths-qty-18/4 \
         /product/grandma-s-dry-dust-mop/1 \
         /product/microfiber-mop-head/5 \
         /product/microfiber-high-duster/6 \
         /product/microfiber-hand-duster/7 \
         /product/kim-s-hair-towel/8 \
         /product/microfiber-fluffy-duster/10; do
  printf '%-45s ' "$p"
  curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' \
    "https://www.kimseco-ezmicrofibers.com$p"
done
```

The rules file is also checked at build time — `npm run build` runs
`scripts/check-redirects.mjs` first, which fails on self-referential loops,
non-301 statuses, rules that shadow a real route, splats that swallow real
routes, and destinations that do not exist. Run it alone with
`npm run check:redirects`.

Then by hand:

- [ ] Home, Shop, About, Events, Contact all render
- [ ] All nine product pages render with the right photos
- [ ] Add to cart → PayPal button loads → Venmo funding appears
- [ ] Free Quincy pickup shows at checkout
- [ ] Contact form actually delivers to `streakfreeks@yahoo.com`
- [ ] Mobile header: wordmark does not collide with the cart icon
- [ ] `https://www.kimseco-ezmicrofibers.com/robots.txt` and `/sitemap.xml` serve
      from the new site, not a Squarespace cache

---

## 5. SEO, the week after

The redirects preserve ranking signal, but only if Google is told to go
looking. In order:

1. **Google Search Console** — add the property if it does not exist, verify by
   DNS TXT at Porkbun (survives host changes; an HTML-file verification will not).
2. **Submit the new sitemap.** The Next app needs one — see the open item below.
3. **Use the Change of Address tool** *only* if the domain itself changes. It
   does not apply to a same-domain platform move, which is what this is.
4. **Request indexing** for the homepage and `/shop` via URL Inspection. The rest
   follows from the sitemap.
5. **Watch Coverage for two weeks.** A short dip is normal. A cliff means a
   redirect is wrong — re-run section 4.
6. **Google Business Profile**, Facebook, and any fair/home-show listings still
   point at Squarespace URLs. Update the ones you control.

### Done

- **Sitemap and robots.txt** — `app/sitemap.ts` and `app/robots.ts` generate
  `/sitemap.xml` (14 absolute URLs: 5 pages + 9 products) and `/robots.txt`.
  `/cart` is disallowed; it is per-visitor and only spends crawl budget.
- **Structured data** — `Store` on every page, plus `Product` + `Offer` and
  `BreadcrumbList` on each product page. This is what puts a price and
  "In stock" under the search result. No `aggregateRating`: we have
  testimonials but no rating data, and invented review markup gets penalised.
- **Per-product canonical and OG tags**, with the product photo as the share
  image and the full description rather than the one-line card caption.

### Still open

- **OG images are `.webp`.** Facebook renders them; X/Twitter has been
  inconsistent about WebP in link previews. If shares matter, generate a JPEG
  copy of the lead photo per product and point `openGraph.images` at that.
- **The printed package label** still reads `www.kimseco-ezmicrofibers.com`.
  Fine until Kim reprints; note it for the next print run.
- **Online payments are not live.** `paypalClientId` and `venmoHandle` in
  `kims-cleaning-next/lib/config.ts` are both `REPLACE_ME`. This is the real
  gate on cutover — do not move DNS until checkout works end to end.

---

## 6. Deferred: the internal rename

Customer-visible text is done. These still say "supplies" and are safe to leave
until the dust settles — nothing about them is user-facing.

- [ ] GitHub repo `t3kdesigns03/kimscleaningsupplies` → `kimscleaningproducts`
      (GitHub redirects the old URL automatically; update the local remote with
      `git remote set-url origin <new>`)
- [ ] Local folder `E:\T3KDesigns\KimsCleaningSupplies`
- [ ] `name` in `package.json` and `kims-cleaning-next/package.json`
- [ ] Netlify site name / `*.netlify.app` subdomain
- [ ] Porkbun CNAME `kimscleaningsupplies.t3kdesigns.app` →
      `kimscleaningproducts.t3kdesigns.app`
- [ ] `REPO` constant in the legacy `404.html` (only matters for GitHub Pages)

---

## 7. Rollback

Nothing here is one-way until Squarespace is cancelled.

1. Point the Porkbun records back at Squarespace.
2. Wait out TTL (300s if you lowered it in step 4).

The 301s live on Netlify, so once DNS moves away they stop firing entirely —
there is no redirect loop to unwind and no cached state to clear beyond the
browser's own, which a hard reload handles.
