/* ------------------------------------------------------------------
   SERVER ONLY. Talks to Supabase's REST API (PostgREST) with fetch.
   - insertOrder uses the public anon key, so RLS (insert-only) applies.
   - listOrders / setStatus use the service role and never reach the browser.
   Never import this file from a "use client" component.
   ------------------------------------------------------------------ */

import type { OrderRow, OrderStatus } from "@/lib/orders";

const URL_ = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function serviceKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

export function supabaseReady(kind: "anon" | "service"): boolean {
  return Boolean(URL_ && (kind === "anon" ? ANON : serviceKey()));
}

function headers(key: string, extra: Record<string, string> = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function fail(res: Response, what: string): Promise<never> {
  const body = await res.text().catch(() => "");
  throw new Error(`${what} failed: ${res.status} ${body.slice(0, 300)}`);
}

export async function insertOrder(row: Omit<OrderRow, "created_at">): Promise<void> {
  const res = await fetch(`${URL_}/rest/v1/orders`, {
    method: "POST",
    // return=minimal: anon has no SELECT, so it cannot read the row back.
    headers: headers(ANON, { Prefer: "return=minimal" }),
    body: JSON.stringify(row),
    cache: "no-store",
  });
  if (!res.ok) await fail(res, "insert order");
}

export async function listOrders(limit = 500): Promise<OrderRow[]> {
  const key = serviceKey();
  const res = await fetch(
    `${URL_}/rest/v1/orders?select=*&order=created_at.desc&limit=${limit}`,
    { headers: headers(key), cache: "no-store" }
  );
  if (!res.ok) await fail(res, "list orders");
  const rows = (await res.json()) as OrderRow[];
  return rows.map((r) => ({
    ...r,
    items: Array.isArray(r.items) ? r.items : [],
    subtotal: r.subtotal == null ? null : Number(r.subtotal),
    shipping: r.shipping == null ? null : Number(r.shipping),
    total: r.total == null ? null : Number(r.total),
  }));
}

export async function setStatus(id: string, status: OrderStatus): Promise<OrderRow | null> {
  const key = serviceKey();
  const res = await fetch(`${URL_}/rest/v1/orders?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: headers(key, { Prefer: "return=representation" }),
    body: JSON.stringify({ status }),
    cache: "no-store",
  });
  if (!res.ok) await fail(res, "update status");
  const rows = (await res.json()) as OrderRow[];
  return rows[0] || null;
}

/** Permanently removes one order. Returns false if no row had that id. */
export async function deleteOrder(id: string): Promise<boolean> {
  const key = serviceKey();
  const res = await fetch(`${URL_}/rest/v1/orders?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: headers(key, { Prefer: "return=representation" }),
    cache: "no-store",
  });
  if (!res.ok) await fail(res, "delete order");
  const rows = (await res.json()) as OrderRow[];
  return rows.length > 0;
}
