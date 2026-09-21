"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart, type Fulfillment } from "./CartProvider";
import SmartImage from "./SmartImage";
import PayPalCheckout from "./PayPalCheckout";
import VenmoBox from "./VenmoBox";
import { config } from "@/lib/config";
import { money } from "@/lib/format";
import { SWATCH, imagesFor } from "@/lib/products";
import { CheckIcon, EmptyCartIcon } from "./Icons";

const SHIP_FIELDS: (keyof ReturnType<typeof useCart>["checkout"])[] = [
  "name", "email", "phone", "address", "city", "state", "zip",
];
const FIELD_LABEL: Record<string, string> = {
  name: "name", email: "email", phone: "phone",
  address: "street address", city: "city", state: "state", zip: "ZIP",
};

export default function CartView() {
  const cart = useCart();
  const { ready, lines, items, subtotal, shipping, total, checkout, setQty, remove, updateCheckout, clear } = cart;
  const [thanks, setThanks] = useState<{ head: string; body: string } | null>(null);

  if (!ready) {
    return <div className="wrap py-16 text-center text-muted">Loading your cart…</div>;
  }

  if (thanks) {
    return (
      <div className="wrap py-9">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-forest text-lime-bright">
            <CheckIcon className="h-9 w-9" />
          </div>
          <h1>{thanks.head}</h1>
          <p className="mx-auto mb-6 max-w-[46ch] text-muted">{thanks.body}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn btn-primary">Back to the shop</Link>
            <Link href="/events" className="btn btn-ghost">See where we&rsquo;ll be</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="wrap py-9">
        <h1>Your cart</h1>
        <div className="py-12 text-center">
          <EmptyCartIcon className="mx-auto mb-4 h-16 w-16 text-line" />
          <h2 className="mt-0">Nothing in here yet</h2>
          <p className="text-muted">Two cloths is the usual place to start.</p>
          <Link href="/shop" className="btn btn-primary">Go to the shop</Link>
        </div>
      </div>
    );
  }

  const missing = (() => {
    const need = checkout.fulfillment === "pickup" ? (["name", "email", "phone"] as const) : SHIP_FIELDS;
    return need.filter((f) => !String(checkout[f] || "").trim()).map((f) => FIELD_LABEL[f]);
  })();
  const blocked = missing.length ? `Add your ${missing.join(", ")} above and the payment buttons appear here.` : "";

  function onPaid(payer: string) {
    const pickup = checkout.fulfillment === "pickup";
    clear();
    setThanks({
      head: payer ? `Thank you, ${payer}` : "Thank you",
      body:
        "Your payment went through. PayPal has emailed you the receipt — that is the one to keep. " +
        (pickup ? "Kim will email you to arrange pickup in Quincy." : "Kim packs orders a couple of times a week and will email when yours is on its way."),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onVenmoPaid() {
    clear();
    setThanks({
      head: "Thank you — we'll watch for it",
      body: "We'll confirm and ship when your Venmo payment lands. Email us if you need a receipt.",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="wrap py-8">
      <h1>Your cart</h1>
      <div className="grid items-start gap-6 pb-8 md:grid-cols-[1.25fr_1fr]">
        {/* lines */}
        <div>
          {lines.map((l) => (
            <div key={l.slug + l.variant} className="grid grid-cols-[84px_1fr] gap-3.5 border-b border-line py-4 md:grid-cols-[104px_1fr]">
              <div className="h-[84px] w-[84px] overflow-hidden rounded-xl border border-line md:h-[104px] md:w-[104px]" style={{ background: "linear-gradient(170deg,#FFFFFF,#EDF6DD)" }}>
                <SmartImage sources={imagesFor(l.product, l.variant)} alt={l.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <div className="font-bold leading-tight">
                  <Link href={`/product/${l.slug}`} className="text-forest-deep no-underline">{l.name}</Link>
                </div>
                {l.variant && (
                  <div className="mt-0.5 inline-flex items-center gap-1.5 text-[0.9rem] text-muted">
                    {SWATCH[l.variant] && (
                      <span className="h-3 w-3 rounded-full border border-black/10" style={{ background: SWATCH[l.variant] }} />
                    )}
                    {l.variant}
                  </div>
                )}
                <div className="mt-2.5 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-stretch overflow-hidden rounded-full border-[1.5px] border-line bg-paper">
                    <button type="button" aria-label="One fewer" onClick={() => setQty(l.slug, l.variant, l.qty - 1)} className="h-[44px] w-[44px] text-[20px] text-forest-deep hover:bg-grass/10">&minus;</button>
                    <input type="number" min={1} max={99} value={l.qty} aria-label="Quantity"
                      onChange={(e) => setQty(l.slug, l.variant, Number(e.target.value) || 0)}
                      className="w-[48px] border-0 bg-transparent text-center text-[16px] font-semibold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" />
                    <button type="button" aria-label="One more" onClick={() => setQty(l.slug, l.variant, l.qty + 1)} className="h-[44px] w-[44px] text-[20px] text-forest-deep hover:bg-grass/10">+</button>
                  </div>
                  <button type="button" className="link-btn" onClick={() => remove(l.slug, l.variant)}>Remove</button>
                  <span className="price ml-auto text-[1.15rem]">{money(l.total)}</span>
                </div>
              </div>
            </div>
          ))}
          <p className="mt-4"><Link href="/shop">&larr; Keep shopping</Link></p>
        </div>

        {/* summary + checkout */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-paper p-[18px] shadow-soft">
            <h3 className="mt-0">How should we get it to you?</h3>
            <div className="mb-4 grid grid-cols-2 gap-2">
              {(["ship", "pickup"] as Fulfillment[]).map((mode) => {
                const on = checkout.fulfillment === mode;
                return (
                  <button key={mode} type="button" aria-pressed={on}
                    onClick={() => updateCheckout({ fulfillment: mode })}
                    className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-lg border-[1.5px] p-2.5 text-[15px] font-semibold
                      ${on ? "border-forest bg-forest text-lime-bright" : "border-line bg-paper text-forest-deep"}`}>
                    {mode === "ship" ? "Ship to me" : "Pickup"}
                    <small className={`text-[0.78rem] font-normal ${on ? "text-lime-bright/85" : "text-muted"}`}>
                      {mode === "ship" ? (config.flatShipping > 0 ? `${money(config.flatShipping)} flat` : "free") : "Quincy, IL · free"}
                    </small>
                  </button>
                );
              })}
            </div>

            {checkout.fulfillment === "pickup" && (
              <div className="mb-4 rounded-2xl border border-[#C9DCAE] bg-[#EFF4E7] p-4 text-forest-deep">
                <strong className="mb-1 block">Free pickup in Quincy.</strong>
                Kim will email you to arrange a time. Pickup is at 2922 Lincoln Hill SW, Quincy, IL.
              </div>
            )}

            <label className="field"><span>Name</span>
              <input type="text" autoComplete="name" value={checkout.name} onChange={(e) => updateCheckout({ name: e.target.value })} />
            </label>
            <label className="field"><span>Email</span>
              <input type="email" autoComplete="email" value={checkout.email} onChange={(e) => updateCheckout({ email: e.target.value })} />
            </label>
            <label className="field"><span>Phone</span>
              <input type="tel" autoComplete="tel" value={checkout.phone} onChange={(e) => updateCheckout({ phone: e.target.value })} />
            </label>

            {checkout.fulfillment === "ship" && (
              <>
                <label className="field"><span>Street address</span>
                  <input type="text" autoComplete="street-address" value={checkout.address} onChange={(e) => updateCheckout({ address: e.target.value })} />
                </label>
                <label className="field"><span>City</span>
                  <input type="text" autoComplete="address-level2" value={checkout.city} onChange={(e) => updateCheckout({ city: e.target.value })} />
                </label>
                <div className="grid gap-x-3.5 sm:grid-cols-2">
                  <label className="field"><span>State</span>
                    <input type="text" maxLength={2} autoComplete="address-level1" placeholder="IL" value={checkout.state} onChange={(e) => updateCheckout({ state: e.target.value })} />
                  </label>
                  <label className="field"><span>ZIP</span>
                    <input type="text" inputMode="numeric" maxLength={10} autoComplete="postal-code" value={checkout.zip} onChange={(e) => updateCheckout({ zip: e.target.value })} />
                  </label>
                </div>
              </>
            )}

            <ul className="m-0 list-none p-0">
              <li className="flex justify-between gap-3 py-2"><span>Subtotal</span><span>{money(subtotal)}</span></li>
              {config.flatShipping > 0 && (
                <li className="flex justify-between gap-3 py-2">
                  <span>Shipping</span>
                  <span>{checkout.fulfillment === "pickup" ? "Free — pickup" : money(shipping)}</span>
                </li>
              )}
              <li className="mt-1.5 flex justify-between gap-3 border-t-2 border-forest-deep pt-3.5 font-serif text-[1.4rem] font-bold text-forest-deep">
                <span>Total</span><span>{money(total)}</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-[18px] shadow-soft">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-[#003087] font-serif text-[18px] font-extrabold text-white">P</span>
              <h3 className="m-0 text-[1.16rem]">Pay with PayPal</h3>
            </div>
            <PayPalCheckout blocked={blocked} onSuccess={onPaid} />
            <p className="mt-3 text-[0.82rem] text-muted">PayPal checkout may also offer Venmo and card for US customers.</p>
          </div>

          <VenmoBox onPaid={onVenmoPaid} />
        </aside>
      </div>
    </div>
  );
}
