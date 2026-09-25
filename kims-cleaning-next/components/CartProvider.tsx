"use client";

/* ------------------------------------------------------------------
   Cart state — React context backed by localStorage. No accounts,
   no server, no inventory database. Clearing the browser clears it.
   ------------------------------------------------------------------ */

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { config } from "@/lib/config";
import { products, getProduct, type Product } from "@/lib/products";
import type { OrderPayment, OrderRequest } from "@/lib/orders";

const KEY = "kims_cart_v1";
const CHECKOUT_KEY = "kims_checkout_v1";
const PENDING_KEY = "kims_pending_orders_v1";

export interface CartItem {
  slug: string;
  variant: string;
  qty: number;
}

export interface Line extends CartItem {
  product: Product;
  name: string;
  unit: number;
  total: number;
}

/** ship = mailed · pickup = Quincy · event = pick up at a fair/show booth */
export type Fulfillment = "ship" | "pickup" | "event";

export interface Checkout {
  fulfillment: Fulfillment;
  /** eventLabel() of the chosen show when fulfillment is "event" */
  eventName: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

const emptyCheckout: Checkout = {
  fulfillment: "ship",
  eventName: "",
  name: "", email: "", phone: "",
  address: "", city: "", state: "", zip: "",
};

interface CartCtx {
  ready: boolean;
  items: CartItem[];
  lines: Line[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  checkout: Checkout;
  add: (slug: string, qty?: number, variant?: string) => void;
  setQty: (slug: string, variant: string, qty: number) => void;
  remove: (slug: string, variant: string) => void;
  clear: () => void;
  updateCheckout: (patch: Partial<Checkout>) => void;
  describe: (max?: number) => string;
  recordPending: (method: string, reference?: string) => void;
  /** The payload POST /api/orders expects for the current cart + checkout. */
  orderRequest: (payment: OrderPayment, paypalId?: string) => OrderRequest;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const Ctx = createContext<CartCtx | null>(null);

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, val: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* private mode / blocked storage — cart just won't persist */
  }
}
const keyOf = (slug: string, variant: string) => slug + "::" + (variant || "");

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkout, setCheckout] = useState<Checkout>(emptyCheckout);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // hydrate from localStorage once on mount
  useEffect(() => {
    const raw = read<CartItem[]>(KEY, []);
    setItems(Array.isArray(raw) ? raw.filter((it) => getProduct(it.slug)) : []);
    setCheckout({ ...emptyCheckout, ...read<Partial<Checkout>>(CHECKOUT_KEY, {}) });
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) write(KEY, items);
  }, [items, ready]);
  useEffect(() => {
    if (ready) write(CHECKOUT_KEY, checkout);
  }, [checkout, ready]);

  const add = useCallback((slug: string, qty = 1, variant = "") => {
    qty = Math.max(1, Math.floor(qty) || 1);
    setItems((prev) => {
      const k = keyOf(slug, variant);
      const hit = prev.find((it) => keyOf(it.slug, it.variant) === k);
      if (hit) {
        return prev.map((it) =>
          keyOf(it.slug, it.variant) === k ? { ...it, qty: Math.min(99, it.qty + qty) } : it
        );
      }
      return [...prev, { slug, variant, qty }];
    });
  }, []);

  const setQty = useCallback((slug: string, variant: string, qty: number) => {
    const k = keyOf(slug, variant);
    setItems((prev) => {
      if (qty <= 0) return prev.filter((it) => keyOf(it.slug, it.variant) !== k);
      return prev.map((it) =>
        keyOf(it.slug, it.variant) === k ? { ...it, qty: Math.min(99, Math.floor(qty)) } : it
      );
    });
  }, []);

  const remove = useCallback((slug: string, variant: string) => setQty(slug, variant, 0), [setQty]);
  const clear = useCallback(() => setItems([]), []);
  const updateCheckout = useCallback((patch: Partial<Checkout>) => {
    setCheckout((c) => ({ ...c, ...patch }));
  }, []);

  const lines = useMemo<Line[]>(() => {
    return items
      .map((it) => {
        const product = getProduct(it.slug);
        if (!product) return null;
        const qty = Math.max(1, it.qty);
        return {
          ...it,
          qty,
          product,
          name: product.name,
          unit: product.price,
          total: product.price * qty,
        };
      })
      .filter(Boolean) as Line[];
  }, [items]);

  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.total, 0), [lines]);
  const count = useMemo(() => items.reduce((n, it) => n + it.qty, 0), [items]);

  const shipping = useMemo(() => {
    const flat = Number(config.flatShipping || 0);
    if (!flat || !items.length || checkout.fulfillment !== "ship") return 0;
    return flat;
  }, [items.length, checkout.fulfillment]);

  const total = subtotal + shipping;

  const describe = useCallback(
    (max = 120) => {
      const parts = lines.map(
        (l) =>
          `${l.qty}x ${l.name.replace("Kim’s Cleaning Cloths — ", "Cloths ")}` +
          (l.variant ? ` (${l.variant})` : "")
      );
      let s = "Kim's order: " + parts.join(", ") + (checkout.fulfillment === "pickup" ? " [PICKUP]" : checkout.fulfillment === "event" ? " [SHOW]" : "");
      return s.length > max ? s.slice(0, max - 1) + "…" : s;
    },
    [lines, checkout.fulfillment]
  );

  const recordPending = useCallback(
    (method: string, reference = "") => {
      const list = read<any[]>(PENDING_KEY, []);
      list.push({
        at: new Date().toISOString(),
        method,
        reference,
        total,
        shipping,
        subtotal,
        customer: checkout,
        lines: lines.map((l) => ({ slug: l.slug, name: l.name, variant: l.variant, qty: l.qty, unit: l.unit })),
      });
      write(PENDING_KEY, list);
    },
    [total, shipping, subtotal, checkout, lines]
  );

  const orderRequest = useCallback(
    (payment: OrderPayment, paypalId = ""): OrderRequest => {
      const c = checkout;
      const ship = c.fulfillment === "ship";
      return {
        fulfillment: c.fulfillment,
        payment,
        paypal_id: paypalId || undefined,
        name: c.name, email: c.email, phone: c.phone,
        event_name: c.fulfillment === "event" ? c.eventName : undefined,
        address: ship ? c.address : undefined,
        city: ship ? c.city : undefined,
        state: ship ? c.state : undefined,
        zip: ship ? c.zip : undefined,
        items: lines.map((l) => ({ slug: l.slug, variant: l.variant, qty: l.qty })),
      };
    },
    [checkout, lines]
  );

  const value: CartCtx = {
    ready, items, lines, count, subtotal, shipping, total, checkout,
    add, setQty, remove, clear, updateCheckout, describe, recordPending, orderRequest,
    drawerOpen, openDrawer, closeDrawer,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}

export { products };
