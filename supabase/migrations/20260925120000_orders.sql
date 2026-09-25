-- Orders log for Kim's Cleaning Products.
-- Checkout (anon key) may INSERT only. Reading and status changes happen on the
-- server with the service role, which bypasses RLS. No customer accounts.

create table if not exists public.orders (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text,
  email        text,
  phone        text,
  fulfillment  text not null check (fulfillment in ('pickup', 'ship', 'event')),
  event_name   text,
  address      text,
  city         text,
  state        text,
  zip          text,
  items        jsonb not null default '[]'::jsonb,  -- [{ slug, name, qty, price, color }]
  subtotal     numeric(10,2),
  shipping     numeric(10,2),
  total        numeric(10,2),
  payment      text check (payment in ('paypal', 'venmo', 'pickup')),
  paypal_id    text,
  status       text not null default 'Received'
               check (status in ('Received', 'Paid', 'Packed', 'Picked up', 'Shipped', 'Done')),
  note         text
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

-- Browser/anon: insert only. No select, update or delete.
revoke all on table public.orders from anon, authenticated;
grant insert on table public.orders to anon, authenticated;

drop policy if exists "checkout inserts orders" on public.orders;
create policy "checkout inserts orders"
  on public.orders
  for insert
  to anon, authenticated
  with check (status in ('Received', 'Paid'));

-- The service role (server only) keeps full access.
grant all on table public.orders to service_role;
