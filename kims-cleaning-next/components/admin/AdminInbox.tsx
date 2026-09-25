"use client";

/* ------------------------------------------------------------------
   /admin order inbox. Built for Kim's phone at a booth: full-bleed rows,
   filters that wrap, big status buttons, and a print pack list.
   Everything goes through /api/admin/* — no keys in the browser.
   ------------------------------------------------------------------ */

import { useCallback, useEffect, useMemo, useState } from "react";
import { money } from "@/lib/format";
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

const STATUS_STYLE: Record<OrderStatus, string> = {
  Received: "bg-[#EFEBDD] text-[#4A4538] border-[#DDD5BD]",
  Paid: "bg-lime-bright text-forest-deep border-lime",
  Packed: "bg-[#FFF1B8] text-[#6B5600] border-gold-soft",
  "Picked up": "bg-[#D8EEC6] text-forest-deep border-leaf",
  Shipped: "bg-[#D8EEC6] text-forest-deep border-leaf",
  Done: "bg-forest-deep text-lime-bright border-forest-deep",
};

function Pill({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[0.8rem] font-bold ${STATUS_STYLE[status] || STATUS_STYLE.Received}`}>
      {status}
    </span>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex max-w-full items-center truncate whitespace-nowrap rounded-full border border-line bg-white px-2.5 py-0.5 text-[0.8rem] font-semibold text-forest-deep">
      {children}
    </span>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border-[1.5px] px-3.5 text-[15px] font-semibold transition active:scale-95
        ${on ? "border-forest bg-forest text-lime-bright" : "border-line bg-white text-forest-deep"}`}
    >
      {children}
    </button>
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

  return (
    <div className="admin min-h-[100dvh] bg-paper text-ink">
      <style>{`
        @media print {
          @page { margin: 0; }
          html, body { background: #fff !important; }
        }
      `}</style>

      {/* ---------- screen ---------- */}
      <div className="print:hidden">
        <header className="sticky top-0 z-30 flex items-center gap-1 whitespace-nowrap bg-forest-deep px-3 py-2 text-lime-bright">
          <h1 className="m-0 mr-auto whitespace-nowrap text-[1.3rem] font-bold text-lime-bright">
            Orders <span className="font-sans text-[0.95rem] font-semibold text-lime-bright/70">{orders.length}</span>
          </h1>
          <button type="button" onClick={refresh} className="min-h-[44px] rounded-full px-2.5 text-[14px] font-semibold text-lime-bright hover:bg-white/10" aria-label="Refresh">
            {loading ? "Loading…" : "Refresh"}
          </button>
          <button type="button" onClick={printPackList} className="min-h-[44px] rounded-full bg-lime px-3.5 text-[14px] font-bold text-forest-deep">
            Print list
          </button>
          <button type="button" onClick={signOut} className="min-h-[44px] rounded-full px-2 text-[13px] text-lime-bright/80 hover:bg-white/10">
            Sign out
          </button>
        </header>

        <section className="border-b border-line bg-wash/60 px-3 py-3" aria-label="Filters">
          <div className="flex flex-wrap gap-2">
            {(["all", "pickup", "ship", "event"] as FFilter[]).map((k) => (
              <Chip key={k} on={ff === k} onClick={() => { setFf(k); if (k !== "event" && k !== "all") setEv(""); }}>
                {k === "all" ? "All" : FULFILLMENT_LABEL[k]}
                <span className="text-[0.8rem] opacity-70">{fCount(k)}</span>
              </Chip>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["all", ...STATUSES] as SFilter[]).map((k) => (
              <Chip key={k} on={sf === k} onClick={() => setSf(k)}>
                {k === "all" ? "Any status" : k}
                <span className="text-[0.8rem] opacity-70">{sCount(k)}</span>
              </Chip>
            ))}
          </div>
          {eventNames.length > 0 && (
            <label className="mt-2 block">
              <span className="sr-only">Show</span>
              <select
                value={ev}
                onChange={(e) => { setEv(e.target.value); if (e.target.value) setFf("event"); }}
                className="min-h-[44px] w-full rounded-lg border-[1.5px] border-line bg-white px-3 text-[16px] text-forest-deep md:w-auto"
              >
                <option value="">All shows</option>
                {eventNames.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
          )}
        </section>

        {error && (
          <p role="alert" className="m-0 border-b border-[#E9C9B5] bg-[#FBEDE4] px-3 py-3 font-semibold text-warn">{error}</p>
        )}

        <div className="flex items-baseline justify-between border-b border-line px-3 py-2 text-[0.9rem] text-muted">
          <span>{shown.length} {shown.length === 1 ? "order" : "orders"}{filterLabel !== "All orders" ? ` · ${filterLabel}` : ""}</span>
          <span className="font-semibold text-forest-deep">{money(shownTotal)}</span>
        </div>

        {/* desktop column heads */}
        <div className="hidden grid-cols-[120px_minmax(0,1.1fr)_minmax(0,2fr)_90px_120px_minmax(0,1.2fr)_110px] gap-3 border-b border-line bg-cream px-3 py-2 text-[0.78rem] font-bold uppercase tracking-wider text-muted md:grid">
          <span>When</span><span>Name</span><span>Items</span><span className="text-right">Total</span><span>Pay</span><span>Fulfillment</span><span>Status</span>
        </div>

        {shown.length === 0 && !error && (
          <p className="px-3 py-10 text-center text-muted">No orders here yet.</p>
        )}

        <ul className="m-0 list-none p-0">
          {shown.map((o) => {
            const isOpen = open === o.id;
            return (
              <li key={o.id} className={`border-b border-line ${isOpen ? "bg-white" : ""}`} data-order-id={o.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : o.id)}
                  className="block w-full px-3 py-3 text-left hover:bg-white md:grid md:grid-cols-[120px_minmax(0,1.1fr)_minmax(0,2fr)_90px_120px_minmax(0,1.2fr)_110px] md:items-center md:gap-3"
                >
                  {/* phone layout */}
                  <span className="flex items-baseline gap-2 md:hidden">
                    <strong className="min-w-0 flex-1 truncate text-[1.08rem] text-forest-deep">{o.name || "—"}</strong>
                    <strong className="text-[1.08rem] text-forest-deep">{money(o.total || 0)}</strong>
                  </span>
                  <span className="mt-0.5 block text-[0.85rem] text-muted md:hidden">{whenFmt.format(new Date(o.created_at))}</span>
                  <span className="mt-1 line-clamp-2 block text-[0.95rem] md:hidden">{itemsSummary(o.items)}</span>
                  <span className="mt-2 flex flex-wrap items-center gap-1.5 md:hidden">
                    <Pill status={o.status} />
                    <Tag>{fulfillmentText(o)}</Tag>
                    <Tag>{o.payment ? PAYMENT_LABEL[o.payment] : "—"}</Tag>
                  </span>

                  {/* desktop columns */}
                  <span className="hidden text-[0.9rem] text-muted md:block">{whenFmt.format(new Date(o.created_at))}</span>
                  <span className="hidden truncate font-semibold text-forest-deep md:block">{o.name || "—"}</span>
                  <span className="hidden truncate text-[0.95rem] md:block">{itemsSummary(o.items)}</span>
                  <span className="hidden text-right font-semibold md:block">{money(o.total || 0)}</span>
                  <span className="hidden text-[0.9rem] md:block">{o.payment ? PAYMENT_LABEL[o.payment] : "—"}</span>
                  <span className="hidden truncate text-[0.9rem] md:block">{fulfillmentText(o)}</span>
                  <span className="hidden md:block"><Pill status={o.status} /></span>
                </button>

                {isOpen && <Ticket o={o} saving={saving === o.id} onStatus={(s) => changeStatus(o, s)} />}
              </li>
            );
          })}
        </ul>
      </div>

      {/* ---------- print: pack list for the current filter ---------- */}
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

function Ticket({ o, saving, onStatus }: { o: OrderRow; saving: boolean; onStatus: (s: OrderStatus) => void }) {
  const phoneDigits = (o.phone || "").replace(/[^\d+]/g, "");
  return (
    <div className="border-t border-dashed border-line px-3 pb-4 pt-3">
      <div className="grid gap-x-6 gap-y-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-1 text-[0.98rem]">
          <div className="text-[0.8rem] font-bold uppercase tracking-wider text-muted">
            #{shortRef(o.id)} · {fullFmt.format(new Date(o.created_at))}
          </div>
          {o.phone && (
            <div>
              <a href={`tel:${phoneDigits}`} className="font-semibold">{o.phone}</a>
              <span className="text-muted"> · </span>
              <a href={`sms:${phoneDigits}`}>text</a>
            </div>
          )}
          {o.email && <div className="break-all"><a href={`mailto:${o.email}`}>{o.email}</a></div>}
          <div className="pt-1">
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
          <div className="text-[0.92rem] text-muted">
            {o.payment ? PAYMENT_LABEL[o.payment] : "—"}
            {o.paypal_id ? ` · PayPal ${o.paypal_id}` : ""}
          </div>
          {o.note && <p className="m-0 mt-2 rounded-lg bg-cream p-2.5 text-[0.95rem]"><b>Note:</b> {o.note}</p>}
        </div>

        <div>
          <ul className="m-0 list-none p-0">
            {o.items.map((i, n) => (
              <li key={n} className="flex gap-3 border-b border-line/70 py-1.5 text-[0.98rem]">
                <b className="w-8 flex-none text-right">{i.qty}×</b>
                <span className="min-w-0 flex-1">{shortName(i.name)}{i.color ? <span className="text-muted"> · {i.color}</span> : null}</span>
                <span className="flex-none">{money(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-1.5 space-y-0.5 text-right text-[0.95rem]">
            {!!o.shipping && <div className="text-muted">Shipping {money(o.shipping)}</div>}
            <div className="font-bold text-forest-deep">Total {money(o.total || 0)}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[0.9rem] text-muted">
        Status: <Pill status={o.status} /> {saving && <span>Saving…</span>}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
        {ACTION_STATUSES.map((s) => {
          const on = o.status === s;
          return (
            <button
              key={s}
              type="button"
              disabled={saving}
              aria-pressed={on}
              onClick={() => onStatus(s)}
              className={`min-h-[56px] rounded-xl border-2 text-[1.05rem] font-bold transition active:scale-[0.98] disabled:opacity-60
                ${on ? "border-forest-deep bg-forest-deep text-lime-bright" : "border-forest/30 bg-white text-forest-deep"}`}
            >
              {s}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {(["Received", "Paid"] as OrderStatus[]).map((s) => (
          <button
            key={s}
            type="button"
            disabled={saving || o.status === s}
            onClick={() => onStatus(s)}
            className="min-h-[44px] rounded-full border border-line bg-white px-4 text-[0.95rem] font-semibold text-forest-deep disabled:opacity-50"
          >
            {s === "Paid" ? "Mark paid" : "Back to received"}
          </button>
        ))}
      </div>
    </div>
  );
}
