"use client";

import { useEffect, useRef } from "react";
import { config } from "@/lib/config";
import { useCart } from "./CartProvider";
import { money2 } from "@/lib/format";

const CUR = config.paypalCurrency || "USD";
const configured = config.paypalClientId && config.paypalClientId !== "REPLACE_ME";

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
  onSuccess: (payer: string) => void;
}) {
  const { subtotal, shipping, checkout, describe } = useCart();
  const hostRef = useRef<HTMLDivElement>(null);
  const btnsRef = useRef<any>(null);

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
              custom_id: [c.fulfillment === "pickup" ? "PICKUP" : "SHIP", c.name, c.phone].filter(Boolean).join(" / ").slice(0, 120),
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
          onApprove: (_d: unknown, actions: any) =>
            actions.order.capture().then((details: any) => {
              const payer = details?.payer?.name?.given_name || "";
              onSuccess(payer);
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
  }, [blocked, subtotal, shipping, checkout.fulfillment, checkout.name, checkout.address, checkout.city, checkout.state, checkout.zip]);

  if (!configured) {
    return (
      <div className="rounded-2xl border border-[#CBD7E4] bg-[#F1F4F8] p-4 text-forest-deep">
        <strong className="mb-1 block">Online checkout turns on when PayPal is connected.</strong>
        Everything else on this page works — Kim just needs to paste her live PayPal client ID into{" "}
        <code>lib/config.ts</code> and card and PayPal buttons appear right here.
      </div>
    );
  }

  if (blocked) {
    return <div className="rounded-2xl border border-line bg-cream p-4 text-forest-deep">{blocked}</div>;
  }

  return <div ref={hostRef}><p className="m-0 text-[0.9rem] text-muted">Loading secure checkout…</p></div>;
}
