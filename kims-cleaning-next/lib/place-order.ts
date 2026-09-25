/* Client helper: POST the order to our own API route (which inserts into
   Supabase). Retries once on a network blip so a paid order isn't lost.
   After a successful save it also posts a copy to the Netlify "order" form
   so Netlify can email it — fire-and-forget, never blocks the customer. */

import type { OrderRequest } from "./orders";
import { shortName, shortRef } from "./orders";
import { getProduct } from "./products";
import { config } from "./config";
import { money } from "./format";

export interface PlacedOrder {
  ok: boolean;
  id?: string;
  error?: string;
}

export async function placeOrder(req: OrderRequest): Promise<PlacedOrder> {
  let last = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const placed = { ok: true, id: data.id as string };
        notifyOrder(req, placed.id, Number(data.total) || 0);
        return placed;
      }
      last = data?.error || `Error ${res.status}`;
      if (res.status < 500) break; // bad input — retrying won't help
    } catch {
      last = "No connection.";
    }
    await new Promise((r) => setTimeout(r, 900));
  }
  return { ok: false, error: last };
}

const FULFILLMENT_TEXT = { pickup: "Pickup (Quincy)", ship: "Ship", event: "At a show" } as const;
const PAYMENT_TEXT = { paypal: "PayPal (paid)", venmo: "Venmo", pickup: "Pay in person" } as const;

/** Email copy via Netlify Forms. Errors are swallowed — /admin is the record. */
function notifyOrder(req: OrderRequest, id: string, total: number) {
  try {
    const ref = shortRef(id);
    const items = req.items
      .map((i) => {
        const p = getProduct(i.slug);
        const name = p ? shortName(p.name) : i.slug;
        const each = p ? ` — ${money(p.price * i.qty)}` : "";
        return `${i.qty} × ${name}${i.variant ? ` (${i.variant})` : ""}${each}`;
      })
      .join("\n");
    const deliverTo =
      req.fulfillment === "ship"
        ? [req.address, req.city, req.state, req.zip].filter(Boolean).join(", ")
        : req.fulfillment === "event"
          ? req.event_name || ""
          : `${config.pickupStreet}, ${config.pickupCityState}`;
    const first = (req.name || "").trim().split(/\s+/)[0] || "Customer";
    const fields: Record<string, string> = {
      "form-name": "order",
      subject: `New order #${ref} · ${first} · ${money(total)} · ${FULFILLMENT_TEXT[req.fulfillment]}`,
      order_ref: ref,
      name: req.name,
      phone: req.phone,
      email: req.email,
      fulfillment: FULFILLMENT_TEXT[req.fulfillment],
      deliver_to: deliverTo,
      items,
      total: money(total),
      payment: PAYMENT_TEXT[req.payment],
      admin: `${window.location.origin}/admin`,
    };
    const body = Object.entries(fields)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v ?? "")}`)
      .join("&");
    fetch("/__forms.html", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never let the email copy break checkout */
  }
}
