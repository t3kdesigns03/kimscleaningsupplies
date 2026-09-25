# Claude prompt — /admin same brand as the store

Live: https://kimscleaningproducts.com/admin

The inbox works. It looks like a generic table. Match the public site: earth green, cream/mint field, serif titles, white tickets, lime pills. Do not change data, filters, or status logic.

## Keep

- Login + `/admin`
- Filters: All / Pickup / Ship / Show + status chips
- Row → ticket → Packed / Picked up / Shipped / Done / Mark paid
- Print list
- Phone-first, margins off (8px max)

## Look

- Same header DNA as the store: cream bar, globe mark, “Kim’s Cleaning Products” / “Orders” — not a flat green strip with system UI
- Page field mint/cream like the shop, not empty white
- Chips like shop filters (filled earth green = active, cream outline = rest)
- Each order is a **card**, not a spreadsheet. Desktop can still be columns inside the card.
- Ticket: product names first, then contact, then big status buttons (lime primary for the next action, outline for the rest)
- Print list stays plain. Screen gets the vibe.

## Do not

- Touch Supabase schema, RLS, checkout insert
- Add customer accounts
- Put `/admin` in the public nav
- Reopen the storefront layout

Push when `/admin` at 1280 and 390 looks like the same brand as `/shop`.
