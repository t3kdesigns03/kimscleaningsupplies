/* ------------------------------------------------------------------
   Order shapes shared by checkout, the /api routes and /admin.
   Safe to import from client code — no secrets in here.
   ------------------------------------------------------------------ */

export const FULFILLMENTS = ["pickup", "ship", "event"] as const;
export type OrderFulfillment = (typeof FULFILLMENTS)[number];

export const PAYMENTS = ["paypal", "venmo", "pickup"] as const;
export type OrderPayment = (typeof PAYMENTS)[number];

export const STATUSES = ["Received", "Paid", "Packed", "Picked up", "Shipped", "Done"] as const;
export type OrderStatus = (typeof STATUSES)[number];

/** The big buttons on an order ticket. */
export const ACTION_STATUSES: OrderStatus[] = ["Packed", "Picked up", "Shipped", "Done"];

export interface OrderItem {
  slug: string;
  name: string;
  qty: number;
  price: number;
  color: string;
}

export interface OrderRow {
  id: string;
  created_at: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  fulfillment: OrderFulfillment;
  event_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  items: OrderItem[];
  subtotal: number | null;
  shipping: number | null;
  total: number | null;
  payment: OrderPayment | null;
  paypal_id: string | null;
  status: OrderStatus;
  note: string | null;
}

/** What the browser sends to POST /api/orders. Prices are recomputed on the server. */
export interface OrderRequest {
  fulfillment: OrderFulfillment;
  payment: OrderPayment;
  paypal_id?: string;
  name: string;
  email: string;
  phone: string;
  event_name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  note?: string;
  items: { slug: string; variant: string; qty: number }[];
}

export const FULFILLMENT_LABEL: Record<OrderFulfillment, string> = {
  pickup: "Pickup",
  ship: "Ship",
  event: "Show",
};

export const PAYMENT_LABEL: Record<OrderPayment, string> = {
  paypal: "PayPal",
  venmo: "Venmo",
  pickup: "Pay in person",
};

/** "Kim’s Cleaning Cloths, 2-Pack" → "Cloths, 2-Pack" for tight rows. */
export function shortName(name: string): string {
  return name.replace(/^Kim[’']s Cleaning /, "").replace(/^Microfiber /, "");
}

export function itemsSummary(items: OrderItem[] | null | undefined): string {
  if (!items?.length) return "—";
  return items
    .map((i) => `${i.qty}× ${shortName(i.name)}${i.color ? ` (${i.color})` : ""}`)
    .join(", ");
}

export function shortRef(id: string): string {
  return id.replace(/-/g, "").slice(0, 6).toUpperCase();
}
