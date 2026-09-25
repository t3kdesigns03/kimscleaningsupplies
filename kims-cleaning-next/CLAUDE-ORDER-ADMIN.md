# Claude prompt — order admin + logging (Supabase)

Live: https://kimscleaningproducts.com/
App: `kims-cleaning-next/`
Supabase (already created, empty — no migrations yet):
- Project: Kimscleaningproducts
- URL: https://lncmqmlckdrngrpdcvgu.supabase.co
- GitHub linked: t3kdesigns03/kimscleaningsupplies

Same job as GlowDaily `dashboard.html` and SmallTownSips admin. Staff only. No customer accounts. No subscribe. No Square.

## 1. Database

Create a migration for table `orders`:

```
id           uuid pk default gen_random_uuid()
created_at   timestamptz default now()
name         text
email        text
phone        text
fulfillment  text   -- pickup | ship | event
event_name   text
address      text
city         text
state        text
zip          text
items        jsonb  -- [{ slug, name, qty, price, color }]
subtotal     numeric
shipping     numeric
total        numeric
payment      text   -- paypal | venmo | pickup
paypal_id    text
status       text default 'Received'  -- Received | Paid | Packed | Picked up | Shipped | Done
note         text
```

RLS:
- Anon/authenticated **insert** only (checkout writes).
- Select/update only via service role on the server (admin).
- Do not expose the service role in the browser.

Env (Netlify + local `.env.local`, never commit secrets):
- `NEXT_PUBLIC_SUPABASE_URL=https://lncmqmlckdrngrpdcvgu.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=` (anon public key)
- `SUPABASE_SERVICE_ROLE_KEY=` (server only)
- `ADMIN_PASSWORD=` (Kim/Alice shared password)
- existing `NEXT_PUBLIC_PAYPAL_CLIENT_ID` if present

## 2. Write the order when money is real

On PayPal/Venmo `onApprove` after capture succeeds, AND on “pay at pickup” submit, insert one row with the payload above. Status `Paid` if PayPal/Venmo captured, `Received` if pickup.

If checkout does not insert today, that is the first bug. Do not ship an empty admin.

## 3. `/admin`

Not in the public nav. Gate with `ADMIN_PASSWORD` (cookie/session). Wrong password = 401.

GlowDaily-shaped:

**Orders**
- Newest first
- Columns: when, name, items summary, total, pay method, fulfillment, status
- Filters: All / Pickup / Ship / Event + status chips
- Event dropdown of fairs that have orders
- Row opens the ticket (address, phone, line items, note)
- Buttons: Packed / Picked up / Shipped / Done (updates `status`)
- Print pack list for the current filter

Mobile: big status buttons, filters wrap. Leave page margins off — full-bleed list on a phone. Print pack list uses `@page { margin: 0 }`. Kim will use this on a phone at a booth.

## 4. Checkout (only what logging needs)

Fulfillment: Pickup (Quincy) / Ship / See us at a show.
Show → pick from the existing events list; store `event_name`.
Ship → address fields required; shipping fee can stay the current flat/$ table — do not add USPS API in this pass.
Thank-you names the fulfillment.

## Do not

- Customer login
- GlowDaily popups / tea / Blaze
- Put service role or admin password in client JS
- Redesign the public site

Done when a pickup test order appears on `/admin` and status changes persist. Push + set Netlify env vars, then redeploy.
