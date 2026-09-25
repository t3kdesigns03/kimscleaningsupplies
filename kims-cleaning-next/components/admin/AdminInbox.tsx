"use client";

/* ------------------------------------------------------------------
   /admin order inbox. Built for Kim's phone at a booth, dressed like the
   store: the store header (AdminHeader), mint field, white order cards,
   earth-green chips, lime for the next thing to do. Print stays plain.
   Everything goes through /api/admin/* — no keys in the browser.
   ------------------------------------------------------------------ */

import { useCallback, useEffect, useMemo, useState } from "react";
import { money } from "@/lib/format";
import AdminHeader from "./AdminHeader";
import {
  ACTION_STATUSES,
  FULFILLMENT_LABEL,
  PAYMENT_LABEL,
  STATUSES,
  itemsSummary,
  shortName,
  shortRef,
  type OrderFulfillment,
  type OrderRow,
  type OrderStatus,
} from "@/lib/orders";

type FFilter = "all" | OrderFulfillment;
type SFilter = "all" | OrderStatus;

const TZ = "America/Chicago";
const whenFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ, month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
});
const fullFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ, weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
});

/* Status pills in the store's palette: cream → lime → gold → leaf → forest. */
const STATUS_STYLE: Record<OrderStatus, string> = {
  Received: "bg-cream text-forest-deep border-line",
  Paid: "bg-lime-bright text-forest-deep border-lime",
  Packed: "bg-[#FFF3C4] text-[#5C4A00] border-gold-soft",
  "Picked up": "bg-wash text-forest-deep border-leaf",
  Shipped: "bg-wash text-forest-deep border-leaf",
  Done: "bg-forest-deep text-lime-bright border-forest-deep",
};

/** The one step that usually comes next, shown in lime on the ticket. */
function nextStep(o: OrderRow): OrderStatus | null {
  const flow: OrderStatus[] = o.fulfillment === "ship" ? ["Packed", "Shipped", "Done"] : ["Packed", "Picked up", "Done"];
  const i = flow.indexOf(o.status);
  if (i === -1) return o.status === "Received" || o.status === "Paid" ? "Packed" : null;
  return flow[i + 1] ?? null;
}

function Pill({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[0.8rem] font-bold ${STATUS_STYLE[status] || STATUS_STYLE.Received}`}>
      {status}
    </span>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex max-w-full items-center truncate whitespace-nowrap rounded-full border border-forest/[0.12] bg-paper px-2.5 py-0.5 text-[0.8rem] font-semibold text-forest-deep">
      {children}
    </span>
  );
}

/* Same chip as the /shop filters: filled earth green = on, cream outline = off. */
function Chip({ on, onClick, count, children }: { on: boolean; onClick: () => void; count: number; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`flex min-h-[44px] flex-none items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] px-[16px] py-2 text-[15px] font-semibold transition active:scale-95
        ${on ? "border-forest bg-forest text-lime-bright" : "border-line bg-paper text-forest-deep hover:border-grass"}`}
    >
      {children}
      <span className={`text-[0.8rem] font-bold ${on ? "text-lime-bright/80" : "text-muted"}`}>{count}</span>
    </button>
  );
}

function RefreshIcon({ spin }: { spin: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={spin ? "animate-spin" : ""}>
      <path d="M20 11a8 8 0 1 0-2.3 5.7" />
      <path d="M20 4v7h-7" />
    </svg>
  );
}

function fulfillmentText(o: OrderRow): string {
  if (o.fulfillment === "event") return o.event_name ? `Show · ${o.event_name}` : "Show";
  if (o.fulfillment === "ship") return `Ship · ${[o.city, o.state].filter(Boolean).join(", ")}`;
  return "Pickup · Quincy";
}

export default function AdminInbox({ initial, initialError }: { initial: OrderRow[]; initialError: string }) {
  const [orders, setOrders] = useState<OrderRow[]>(initial);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);
  const [ff, setFf] = useState<FFilter>("all");
  const [sf, setSf] = useState<SFilter>("all");
  const [ev, setEv] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [printedAt, setPrintedAt] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (res.status === 401) {
        window.location.reload();
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not load orders.");
      setOrders(data.orders);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  // New orders show up without touching anything: every minute, and whenever
  // the phone comes back to this tab.
  useEffect(() => {
    const tick = () => document.visibilityState === "visible" && refresh();
    const t = setInterval(tick, 60_000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [refresh]);

  const eventNames = useMemo(
    () => Array.from(new Set(orders.filter((o) => o.fulfillment === "event" && o.event_name).map((o) => o.event_name as string))),
    [orders]
  );

  const byF = useMemo(
    () => orders.filter((o) => (ff === "all" || o.fulfillment === ff) && (!ev || o.event_name === ev)),
    [orders, ff, ev]
  );
  const shown = useMemo(() => byF.filter((o) => sf === "all" || o.status === sf), [byF, sf]);
  const shownTotal = shown.reduce((s, o) => s + (o.total || 0), 0);

  const fCount = (k: FFilter) => orders.filter((o) => (k === "all" || o.fulfillment === k) && (!ev || o.event_name === ev)).length;
  const sCount = (k: SFilter) => byF.filter((o) => k === "all" || o.status === k).length;

  async function changeStatus(o: OrderRow, status: OrderStatus) {
    if (o.status === status || saving) return;
    const before = o.status;
    setSaving(o.id);
    setOrders((list) => list.map((x) => (x.id === o.id ? { ...x, status } : x)));
    try {
      const res = await fetch(`/api/admin/orders/${o.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.status === 401) {
        window.location.reload();
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not save.");
      setOrders((list) => list.map((x) => (x.id === o.id ? { ...x, ...data.order } : x)));
      setError("");
    } catch (e) {
      setOrders((list) => list.map((x) => (x.id === o.id ? { ...x, status: before } : x)));
      setError(e instanceof Error ? `${e.message} Status not changed.` : "Status not changed.");
    } finally {
      setSaving(null);
    }
  }

  async function signOut() {
    await fetch("/api/admin/login", { method: "DELETE" }).catch(() => {});
    window.location.reload();
  }

  function printPackList() {
    setPrintedAt(fullFmt.format(new Date()));
    // let React paint the timestamp before the print dialog snapshots the page
    setTimeout(() => window.print(), 50);
  }

  const filterLabel = [
    ff === "all" ? "All orders" : FULFILLMENT_LABEL[ff],
    ev || "",
    sf === "all" ? "" : sf,
  ].filter(Boolean).join(" · ");

  // pick totals for the pack list: how many of each thing to pull
  const pickTotals = useMemo(() => {
    const m = new Map<string, number>();
    for (const o of shown) for (const i of o.items) {
      const k = shortName(i.name) + (i.color ? ` (${i.color})` : "");
      m.set(k, (m.get(k) || 0) + i.qty);
    }
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [shown]);

  const COLS = "md:grid md:grid-cols-[112px_minmax(0,1.1fr)_minmax(0,2fr)_84px_minmax(0,1.3fr)_104px] md:items-center md:gap-4";

  return (
    <div className="admin min-h-[100dvh] bg-wash text-ink print:bg-white">
      <style>{`
        @media print {
          @page { margin: 0; }
          html, body { background: #fff !important; }
        }
      `}</style>

      {/* ---------- screen ---------- */}
      <div className="print:hidden">
        {/* the store header: promo bar + cream nav with the globe and wordmark */}
        <AdminHeader mode="inbox" loading={loading} onRefresh={refresh} onPrint={printPackList} onSignOut={signOut} />

        <div className="mx-auto max-w-site px-2 pb-10 md:px-4">
          {/* page title on the mint field, under the store header */}
          <div className="flex items-center gap-2 pb-1 pt-4 md:pt-7">
            <h1 className="m-0 mr-auto flex items-baseline gap-2.5 font-serif text-[2rem] font-semibold leading-none text-forest-deep md:text-[2.6rem]">
              Orders
              <span className="rounded-full bg-forest px-2.5 py-0.5 font-sans text-[0.85rem] font-bold leading-snug text-lime-bright">
                {orders.length}
              </span>
            </h1>
            {/* phone: Refresh + Print live here; md+ they're in the header */}
            <button
              type="button"
              onClick={refresh}
              aria-label="Refresh orders"
              className="flex h-11 w-11 flex-none items-center justify-center rounded-full border-[1.5px] border-line bg-paper text-forest-deep md:hidden"
            >
              <RefreshIcon spin={loading} />
            </button>
            <button type="button" onClick={printPackList} className="btn btn-lime btn-sm flex-none md:hidden">
              Print list
            </button>
          </div>

          {/* filters — same chips as /shop */}
          <section className="pt-3" aria-label="Filters">
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {(["all", "pickup", "ship", "event"] as FFilter[]).map((k) => (
                <Chip key={k} on={ff === k} count={fCount(k)} onClick={() => { setFf(k); if (k !== "event" && k !== "all") setEv(""); }}>
                  {k === "all" ? "All" : FULFILLMENT_LABEL[k]}
                </Chip>
              ))}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5 md:mt-2 md:gap-2">
              {(["all", ...STATUSES] as SFilter[]).map((k) => (
                <Chip key={k} on={sf === k} count={sCount(k)} onClick={() => setSf(k)}>
                  {k === "all" ? "Any status" : k}
                </Chip>
              ))}
            </div>
            {eventNames.length > 0 && (
              <label className="mt-2 block">
                <span className="sr-only">Show</span>
                <select
                  value={ev}
                  onChange={(e) => { setEv(e.target.value); if (e.target.value) setFf("event"); }}
                  className="min-h-[44px] w-full rounded-full border-[1.5px] border-line bg-paper px-4 text-[16px] font-semibold text-forest-deep md:w-auto"
                >
                  <option value="">All shows</option>
                  {eventNames.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
            )}
          </section>

          {error && (
            <p role="alert" className="m-0 mt-3 rounded-2xl border border-[#E9C9B5] bg-[#FBEDE4] px-4 py-3 font-semibold text-warn">{error}</p>
          )}

          <div className="mt-4 flex items-baseline justify-between px-1 pb-2">
            <span className="text-[0.95rem] text-muted">
              {shown.length} {shown.length === 1 ? "order" : "orders"}{filterLabel !== "All orders" ? ` · ${filterLabel}` : ""}
            </span>
            <span className="font-serif text-[1.15rem] font-bold text-forest-deep">{money(shownTotal)}</span>
          </div>

          {/* desktop column heads, aligned with the columns inside each card */}
          {shown.length > 0 && (
            <div className={`hidden px-4 pb-1.5 text-[0.74rem] font-bold uppercase tracking-[0.12em] text-forest-deep/60 ${COLS}`}>
              <span>When</span><span>Name</span><span>Items</span><span className="text-right">Total</span><span>Fulfillment</span><span>Status</span>
            </div>
          )}

          {shown.length === 0 && !error && (
            <div className="rounded-2xl border border-line bg-paper px-4 py-12 text-center">
              <p className="m-0 font-serif text-[1.3rem] font-semibold text-forest-deep">No orders here yet.</p>
              <p className="m-0 mt-1 text-muted">New ones show up on their own every minute.</p>
            </div>
          )}

          <ul className="m-0 list-none space-y-2 p-0">
            {shown.map((o) => {
              const isOpen = open === o.id;
              return (
                <li
                  key={o.id}
                  data-order-id={o.id}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-soft transition ${isOpen ? "border-leaf ring-2 ring-leaf/40" : "border-line"}`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : o.id)}
                    className={`block w-full px-4 py-3.5 text-left hover:bg-paper ${COLS}`}
                  >
                    {/* phone layout */}
                    <span className="flex items-baseline gap-2 md:hidden">
                      <strong className="min-w-0 flex-1 truncate font-serif text-[1.15rem] font-semibold text-forest-deep">{o.name || "—"}</strong>
                      <strong className="font-serif text-[1.15rem] font-bold text-forest-deep">{money(o.total || 0)}</strong>
                    </span>
                    <span className="mt-0.5 block text-[0.85rem] text-muted md:hidden">
                      {whenFmt.format(new Date(o.created_at))} · {o.payment ? PAYMENT_LABEL[o.payment] : "—"}
                    </span>
                    <span className="mt-1.5 line-clamp-2 block text-[0.98rem] text-ink md:hidden">{itemsSummary(o.items)}</span>
                    <span className="mt-2.5 flex flex-wrap items-center gap-1.5 md:hidden">
                      <Pill status={o.status} />
                      <Tag>{fulfillmentText(o)}</Tag>
                    </span>

                    {/* desktop columns inside the card */}
                    <span className="hidden text-[0.9rem] text-muted md:block">{whenFmt.format(new Date(o.created_at))}</span>
                    <span className="hidden truncate font-serif text-[1.08rem] font-semibold text-forest-deep md:block">{o.name || "—"}</span>
                    <span className="hidden truncate text-[0.96rem] md:block">{itemsSummary(o.items)}</span>
                    <span className="hidden text-right font-serif text-[1.08rem] font-bold text-forest-deep md:block">{money(o.total || 0)}</span>
                    <span className="hidden min-w-0 md:block"><Tag>{fulfillmentText(o)}</Tag></span>
                    <span className="hidden md:block"><Pill status={o.status} /></span>
                  </button>

                  {isOpen && <Ticket o={o} saving={saving === o.id} onStatus={(s) => changeStatus(o, s)} />}
                </li>
              );
            })}
          </ul>

        </div>
      </div>

      {/* ---------- print: pack list for the current filter (plain) ---------- */}
      <div className="hidden bg-white p-[10mm] text-[11pt] text-black print:block">
        <h1 className="m-0 font-serif text-[18pt] text-black">Pack list — {filterLabel}</h1>
        <p className="m-0 mb-3 text-[9pt]">
          {shown.length} {shown.length === 1 ? "order" : "orders"} · {money(shownTotal)} · printed {printedAt}
        </p>
        {pickTotals.length > 0 && (
          <div className="mb-4 border-y-2 border-black py-2">
            <strong className="text-[10pt] uppercase tracking-wider">Pull from stock</strong>
            <ul className="m-0 mt-1 columns-2 list-none p-0">
              {pickTotals.map(([k, n]) => (
                <li key={k}><b>{n}</b> × {k}</li>
              ))}
            </ul>
          </div>
        )}
        {shown.map((o) => (
          <section key={o.id} className="mb-3 break-inside-avoid border-b border-black/40 pb-2">
            <div className="flex justify-between gap-4">
              <strong>{o.name || "—"} <span className="font-normal">#{shortRef(o.id)}</span></strong>
              <span>{o.status} · {money(o.total || 0)} · {o.payment ? PAYMENT_LABEL[o.payment] : ""}</span>
            </div>
            <div className="text-[10pt]">
              {whenFmt.format(new Date(o.created_at))} · {o.phone || ""} {o.email ? `· ${o.email}` : ""}
            </div>
            <div className="text-[10pt]">
              {o.fulfillment === "ship"
                ? `Ship to: ${[o.address, o.city, o.state, o.zip].filter(Boolean).join(", ")}`
                : o.fulfillment === "event"
                  ? `Show: ${o.event_name || ""}`
                  : "Pickup — Quincy"}
            </div>
            <ul className="m-0 mt-1 list-none p-0">
              {o.items.map((i, n) => (
                <li key={n}>☐ {i.qty} × {shortName(i.name)}{i.color ? ` (${i.color})` : ""}</li>
              ))}
            </ul>
            {o.note && <div className="mt-1 text-[10pt] italic">Note: {o.note}</div>}
          </section>
        ))}
      </div>
    </div>
  );
}

/* Ticket: what to pack first, then who it's for, then the buttons. */
function Ticket({ o, saving, onStatus }: { o: OrderRow; saving: boolean; onStatus: (s: OrderStatus) => void }) {
  const phoneDigits = (o.phone || "").replace(/[^\d+]/g, "");
  const next = nextStep(o);
  return (
    <div className="border-t border-dashed border-line bg-paper px-4 pb-4 pt-4">
      <div className="grid gap-x-8 gap-y-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* 1. products */}
        <div>
          <p className="eyebrow m-0 mb-1.5">Pack</p>
          <ul className="m-0 list-none p-0">
            {o.items.map((i, n) => (
              <li key={n} className="flex items-baseline gap-3 border-b border-line py-2">
                <b className="w-9 flex-none font-serif text-[1.25rem] text-forest-deep">{i.qty}×</b>
                <span className="min-w-0 flex-1 text-[1.02rem] font-semibold text-ink">
                  {shortName(i.name)}
                  {i.color ? <span className="font-normal text-muted"> · {i.color}</span> : null}
                </span>
                <span className="flex-none text-[0.95rem] text-muted">{money(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-baseline justify-end gap-4 text-[0.95rem]">
            {!!o.shipping && <span className="text-muted">Shipping {money(o.shipping)}</span>}
            <span className="font-serif text-[1.2rem] font-bold text-forest-deep">Total {money(o.total || 0)}</span>
          </div>
          {o.note && <p className="m-0 mt-3 rounded-xl border border-line bg-cream p-3 text-[0.95rem]"><b>Note:</b> {o.note}</p>}
        </div>

        {/* 2. contact + how it gets to them */}
        <div className="space-y-1 text-[0.98rem]">
          <p className="eyebrow m-0 mb-1.5">For</p>
          <div className="font-serif text-[1.15rem] font-semibold text-forest-deep">{o.name || "—"}</div>
          {o.phone && (
            <div>
              <a href={`tel:${phoneDigits}`} className="font-semibold">{o.phone}</a>
              <span className="text-muted"> · </span>
              <a href={`sms:${phoneDigits}`}>text</a>
            </div>
          )}
          {o.email && <div className="break-all"><a href={`mailto:${o.email}`}>{o.email}</a></div>}
          <div className="pt-2">
            {o.fulfillment === "ship" && (
              <>
                <strong className="block text-forest-deep">Ship to</strong>
                <span className="block">{o.address}</span>
                <span className="block">{[o.city, o.state].filter(Boolean).join(", ")} {o.zip}</span>
              </>
            )}
            {o.fulfillment === "event" && (
              <>
                <strong className="block text-forest-deep">Picking up at the show</strong>
                <span className="block">{o.event_name}</span>
              </>
            )}
            {o.fulfillment === "pickup" && <strong className="block text-forest-deep">Pickup in Quincy</strong>}
          </div>
          <div className="pt-1 text-[0.9rem] text-muted">
            {o.payment ? PAYMENT_LABEL[o.payment] : "—"}
            {o.paypal_id ? ` · PayPal ${o.paypal_id}` : ""}
            {" · "}#{shortRef(o.id)} · {fullFmt.format(new Date(o.created_at))}
          </div>
        </div>
      </div>

      {/* 3. status */}
      <div className="mt-5 flex items-center gap-2 text-[0.92rem] text-muted">
        Now: <Pill status={o.status} /> {saving && <span>Saving…</span>}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
        {ACTION_STATUSES.map((s) => {
          const on = o.status === s;
          const isNext = s === next;
          return (
            <button
              key={s}
              type="button"
              disabled={saving}
              aria-pressed={on}
              onClick={() => onStatus(s)}
              className={`min-h-[56px] rounded-full border-2 text-[1.05rem] font-bold transition active:scale-[0.98] disabled:opacity-60
                ${on
                  ? "border-forest-deep bg-forest-deep text-lime-bright"
                  : isNext
                    ? "border-lime bg-lime text-forest-deep shadow-soft hover:bg-leaf"
                    : "border-forest/25 bg-white text-forest-deep hover:border-grass"}`}
            >
              {on ? `✓ ${s}` : s}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {(["Paid", "Received"] as OrderStatus[]).map((s) => (
          <button
            key={s}
            type="button"
            disabled={saving || o.status === s}
            onClick={() => onStatus(s)}
            className="min-h-[44px] rounded-full border-[1.5px] border-line bg-white px-4 text-[0.95rem] font-semibold text-forest-deep hover:border-grass disabled:opacity-50"
          >
            {s === "Paid" ? "Mark paid" : "Back to received"}
          </button>
        ))}
      </div>
    </div>
  );
}
