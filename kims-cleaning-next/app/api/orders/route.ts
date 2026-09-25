import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getProduct } from "@/lib/products";
import { events, eventLabel } from "@/lib/events";
import { config } from "@/lib/config";
import { FULFILLMENTS, PAYMENTS, type OrderItem, type OrderRequest } from "@/lib/orders";
import { insertOrder, supabaseReady } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

const clip = (v: unknown, n = 200) => (typeof v === "string" ? v.trim().slice(0, n) : "");
const round2 = (n: number) => Math.round(n * 100) / 100;

/* Checkout writes one row here. Names and prices come from the catalog on the
   server, never from the browser. Inserts with the anon key, so RLS applies. */
export async function POST(req: Request) {
  let body: Partial<OrderRequest> & { website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // honeypot — real shoppers never fill this
  if (body.website) return NextResponse.json({ ok: true, id: randomUUID() });

  const fulfillment = body.fulfillment;
  const payment = body.payment;
  if (!fulfillment || !FULFILLMENTS.includes(fulfillment)) return bad("Pick pickup, ship, or a show.");
  if (!payment || !PAYMENTS.includes(payment)) return bad("Unknown payment method.");

  const name = clip(body.name, 120);
  const email = clip(body.email, 160);
  const phone = clip(body.phone, 40);
  if (!name || !email || !phone) return bad("Name, email and phone are required.");

  let address = "", city = "", state = "", zip = "", event_name = "";
  if (fulfillment === "ship") {
    address = clip(body.address, 200);
    city = clip(body.city, 80);
    state = clip(body.state, 2).toUpperCase();
    zip = clip(body.zip, 10);
    if (!address || !city || !state || !zip) return bad("Shipping needs a full address.");
  }
  if (fulfillment === "event") {
    event_name = clip(body.event_name, 160);
    if (!events.some((e) => eventLabel(e) === event_name)) return bad("Pick a show from the list.");
  }

  const raw = Array.isArray(body.items) ? body.items.slice(0, 40) : [];
  const items: OrderItem[] = [];
  for (const it of raw) {
    const p = getProduct(String(it?.slug || ""));
    const qty = Math.min(99, Math.max(0, Math.floor(Number(it?.qty) || 0)));
    if (!p || !qty) continue;
    const color = clip(it?.variant, 40);
    if (color && !p.options?.some((o) => o.value === color)) continue;
    items.push({ slug: p.slug, name: p.name, qty, price: p.price, color });
  }
  if (!items.length) return bad("Your cart is empty.");

  const subtotal = round2(items.reduce((s, i) => s + i.price * i.qty, 0));
  const shipping = fulfillment === "ship" ? round2(Number(config.flatShipping || 0)) : 0;
  const total = round2(subtotal + shipping);

  const paid = payment === "paypal" || (payment === "venmo" && Boolean(body.paypal_id));

  if (!supabaseReady("anon")) {
    console.error("orders: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY not set");
    return NextResponse.json({ error: "Orders are not connected yet." }, { status: 503 });
  }

  const id = randomUUID();
  try {
    await insertOrder({
      id,
      name, email, phone,
      fulfillment,
      event_name: event_name || null,
      address: address || null,
      city: city || null,
      state: state || null,
      zip: zip || null,
      items,
      subtotal, shipping, total,
      payment,
      paypal_id: clip(body.paypal_id, 64) || null,
      status: paid ? "Paid" : "Received",
      note: clip(body.note, 500) || null,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not save the order." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id, total });
}

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

