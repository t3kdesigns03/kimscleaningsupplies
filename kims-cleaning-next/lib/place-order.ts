/* Client helper: POST the order to our own API route (which inserts into
   Supabase). Retries once on a network blip so a paid order isn't lost. */

import type { OrderRequest } from "./orders";

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
      if (res.ok) return { ok: true, id: data.id };
      last = data?.error || `Error ${res.status}`;
      if (res.status < 500) break; // bad input — retrying won't help
    } catch {
      last = "No connection.";
    }
    await new Promise((r) => setTimeout(r, 900));
  }
  return { ok: false, error: last };
}
