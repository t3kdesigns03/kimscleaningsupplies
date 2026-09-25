"use client";

import { useEffect, useRef } from "react";
import { config } from "@/lib/config";
import { useCart } from "./CartProvider";
import { money2 } from "@/lib/format";
import { placeOrder, type PlacedOrder } from "@/lib/place-order";

const CUR = config.paypalCurrency || "USD";
/** False when NEXT_PUBLIC_PAYPAL_CLIENT_ID is empty — the PayPal box is skipped entirely. */
export const paypalConfigured = Boolean(config.paypalClientId && config.paypalClientId !== "REPLACE_ME");
const configured = paypalConfigured;

declare global {
  interface Window {
    paypal?: any;
  }
}

let sdkPromise: Promise<any> | null = null;
function loadSdk(): Promise<any> {
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    if (window.paypal) return resolve(window.paypal);
    const params = [
      `client-id=${encodeURIComponent(config.paypalClientId)}`,
      `currency=${encodeURIComponent(CUR)}`,
      "components=buttons",
      "intent=capture",
    ];
    if (config.enableVenmo) params.push("enable-funding=venmo");
    const s = document.createElement("script");
    s.src = "https://www.paypal.com/sdk/js?" + params.join("&");
    s.onload = () => resolve(window.paypal);
    s.onerror = () => reject(new Error("PayPal SDK failed to load"));
    document.head.appendChild(s);
  });
  return sdkPromise;
}

export default function PayPalCheckout({
  blocked,
  onSuccess,
}: {
  blocked: string;
  onSuccess: (payer: string, placed: PlacedOrder) => void;
}) {
  const { subtotal, shipping, checkout, describe, orderRequest, recordPending } = useCart();
  const hostRef = useRef<HTMLDivElement>(null);
  const btnsRef = useRef<any>(null);
  // PayPal's buttons keep the callbacks from their first render; read the
  // latest cart/contact details through refs when the payment completes.
  const reqRef = useRef(orderRequest);
  reqRef.current = orderRequest;
  const pendingRef = useRef(recordPending);
  pendingRef.current = recordPending;

  useEffect(() => {
    if (!configured || blocked) return;
    let cancelled = false;

    loadSdk()
      .then((paypal) => {
        if (cancelled || !hostRef.current) return;
        hostRef.current.innerHTML = "";
        btnsRef.current = paypal.Buttons({
          style: { layout: "vertical", shape: "pill", color: "gold", label: "paypal", height: 48 },
          createOrder: (_d: unknown, actions: any) => {
            const c = checkout;
            const unit: any = {
              description: describe(120),
              custom_id: [c.fulfillment === "pickup" ? "PICKUP" : c.fulfillment === "event" ? "SHOW" : "SHIP", c.name, c.phone].filter(Boolean).join(" / ").slice(0, 120),
              amount: {
                currency_code: CUR,
                value: money2(subtotal + shipping),
                breakdown: {
                  item_total: { currency_code: CUR, value: money2(subtotal) },
                  shipping: { currency_code: CUR, value: money2(shipping) },
                },
              },
            };
            const app: any = { shipping_preference: "NO_SHIPPING" };
            if (c.fulfillment === "ship" && c.address && c.city && c.state && c.zip) {
              unit.shipping = {
                name: { full_name: c.name || "" },
                address: {
                  address_line_1: c.address,
                  admin_area_2: c.city,
                  admin_area_1: c.state,
                  postal_code: c.zip,
                  country_code: "US",
                },
              };
              app.shipping_preference = "SET_PROVIDED_ADDRESS";
            }
            return actions.order.create({ purchase_units: [unit], application_context: app });
          },
          onApprove: (data: any, actions: any) =>
            actions.order.capture().then(async (details: any) => {
              const payer = details?.payer?.name?.given_name || "";
              // Money is captured — log the order. Venmo through PayPal reports paymentSource "venmo".
              const src = data?.paymentSource === "venmo" ? "venmo" : "paypal";
              const paypalId = String(details?.id || data?.orderID || "");
              const placed = await placeOrder(reqRef.current(src, paypalId));
              if (!placed.ok) pendingRef.current(src, paypalId); // local backup copy
              onSuccess(payer, placed);
            }),
          onError: (err: unknown) => {
            console.error(err);
            if (hostRef.current) {
              const box = document.createElement("div");
              box.className = "mt-3 rounded-2xl border border-line bg-cream p-4";
              box.innerHTML =
                `<strong>That didn't go through.</strong> Nothing was charged. Try again, or email ` +
                `<a href="mailto:${config.contactEmail}">${config.contactEmail}</a>.`;
              hostRef.current.appendChild(box);
            }
          },
        });
        btnsRef.current.render(hostRef.current).catch((e: unknown) => console.error(e));
      })
      .catch(() => {
        if (hostRef.current)
          hostRef.current.innerHTML =
            `<div class="rounded-2xl border border-line bg-cream p-4">Checkout could not load just now. Please try again, or email <a href="mailto:${config.contactEmail}">${config.contactEmail}</a>.</div>`;
      });

    return () => {
      cancelled = true;
      if (btnsRef.current?.close) {
        try {
          btnsRef.current.close();
        } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocked, subtotal, shipping, checkout.fulfillment, checkout.eventName, checkout.name, checkout.phone, checkout.address, checkout.city, checkout.state, checkout.zip]);

  if (!configured) return null;

  if (blocked) {
    return <div className="rounded-2xl border border-line bg-cream p-4 text-forest-deep">{blocked}</div>;
  }

  return <div ref={hostRef}><p className="m-0 text-[0.9rem] text-muted">Loading secure checkout…</p></div>;
}
