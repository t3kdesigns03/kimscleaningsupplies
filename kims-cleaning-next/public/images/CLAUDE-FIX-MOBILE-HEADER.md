# FIX — Mobile header: title and cart overlap

Repo: https://github.com/t3kdesigns03/kimscleaningsupplies  
Branch: `next-migration`  
App folder: `kims-cleaning-next/`  
Live: https://kimscleaningsupplies.netlify.app/  
Work in `E:\T3KDesigns\KimsCleaningSupplies\kims-cleaning-next`

This is the **Next.js** site. Do not touch the static HTML at the repo root.

## Confirm the bug

On a real phone (~360–400px) the sticky header is:

`[ Kim's Cleaning Products ] [cart] [hamburger]`

The wordmark is too wide. **“Supplies” runs under the cart icon.** Cart and title occupy the same pixels. The hamburger is fine. The cream header also sits tight on the green globe hero so the earth graphic shows through the header gap.

Screenshot reference: cart icon sits on top of the last letters of “Supplies.”

## Fix — `components/Header.tsx` plus its CSS only

Do not redesign the brand. Do not change copy, cart logic, or the desktop header.

### Mobile (< 768px)

1. **Three reserved columns.** Flex or grid, no wrapping:
   - Left: wordmark (flex 1, min-width 0)
   - Right cluster: cart + hamburger, **fixed width**, `flex-shrink: 0`, gap 8–12px
2. Wordmark must **shrink**, not collide:
   - Hide the “ECO EASY MICROFIBER” subline below ~400px, or make it `truncate`
   - Scale the title: ~1.05–1.15rem on a 360px screen so “Kim’s Cleaning Products” fits on **one line** in the left column
   - `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` as a last resort — prefer a slightly smaller type so the full name still shows
3. Cart button:
   - Own 44×44 tap target
   - Never `position: absolute` over the title
   - Badge sits on the icon, not on the word “Supplies”
4. Header height ~56–64px. Opaque cream/white background (`bg` solid, not transparent). `z-index` above the hero so the globe does not bleed through the bar.
5. Add `padding-right` so the title cannot enter the icon cluster.

### Desktop (≥ 768px)

Leave the current layout. Full name + subline + nav + cart. No overlap there.

## Done when

- Chrome device mode 360, 375, 390, 414: title and cart do not share pixels.
- Cart is tappable without hitting the title.
- Hamburger still opens.
- Header does not wrap to two rows of icons.
- Push `next-migration` so Netlify rebuilds.

Check `/`, `/shop`, `/cart` at 375px before you stop.
