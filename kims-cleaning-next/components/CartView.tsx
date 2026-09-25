"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart, type Checkout, type Fulfillment } from "./CartProvider";
import SmartImage from "./SmartImage";
import PayPalCheckout, { paypalConfigured } from "./PayPalCheckout";
import VenmoBox, { venmoConfigured } from "./VenmoBox";
import { config, pickupAddress } from "@/lib/config";
import { splitEvents, eventLabel } from "@/lib/events";
import { placeOrder, type PlacedOrder } from "@/lib/place-order";
import { shortRef } from "@/lib/orders";
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

const MODES: { key: Fulfillment; label: string; note: string }[] = [
  { key: "ship", label: "Ship to me", note: config.flatShipping > 0 ? `${money(config.flatShipping)} flat` : "free" },
  { key: "pickup", label: "Pickup", note: "Quincy, IL · free" },
  { key: "event", label: "At a show", note: "pick up at the booth" },
];

/** One sentence for the thank-you screen that names how the order gets to them. */
function fulfillmentLine(c: Checkout): string {
  if (c.fulfillment === "event") return `We'll have it waiting for you at ${c.eventName || "the show"}.`;
  if (c.fulfillment === "pickup") return `Pickup in Quincy — Kim will call or email to set a time. Pickup is at ${pickupAddress}.`;
  const where = [c.city, c.state.toUpperCase()].filter(Boolean).join(", ");
  return `Shipping to ${where || "you"}. Kim packs orders a couple of times a week and will email when yours is on its way.`;
}

export default function CartView() {
  const cart = useCart();
  const { ready, lines, items, subtotal, shipping, total, checkout, setQty, remove, updateCheckout, clear, orderRequest } = cart;
  const [thanks, setThanks] = useState<{ head: string; body: string; ref?: string } | null>(null);
  const [placing, setPlacing] = useState(false);
  const [placeErr, setPlaceErr] = useState("");
  const upcoming = useMemo(() => splitEvents().upcoming, []);

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
          <p className="mx-auto mb-3 max-w-[46ch] text-muted">{thanks.body}</p>
          {thanks.ref && <p className="mx-auto mb-6 font-semibold text-forest-deep">Order #{thanks.ref}</p>}
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

  const inPerson = checkout.fulfillment !== "ship";
  const missing = (() => {
    const need = inPerson ? (["name", "email", "phone"] as const) : SHIP_FIELDS;
    const out = need.filter((f) => !String(checkout[f] || "").trim()).map((f) => FIELD_LABEL[f]);
    if (checkout.fulfillment === "event" && !checkout.eventName) out.unshift("show");
    return out;
  })();
  const blocked = missing.length ? `Add your ${missing.join(", ")} above to place the order.` : "";
  const onlinePay = paypalConfigured || venmoConfigured;

  function done(head: string, body: string, placed?: PlacedOrder) {
    clear();
    setThanks({ head, body, ref: placed?.ok && placed.id ? shortRef(placed.id) : undefined });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const notSaved = (placed: PlacedOrder) =>
    placed.ok ? "" : ` If you don't hear from Kim in two days, email ${config.contactEmail}.`;

  function onPaid(payer: string, placed: PlacedOrder) {
    done(
      payer ? `Thank you, ${payer}` : "Thank you",
      "Your payment went through. PayPal has emailed you the receipt — that is the one to keep. " +
        fulfillmentLine(checkout) + notSaved(placed),
      placed
    );
  }

  function onVenmoPaid(placed: PlacedOrder) {
    done(
      "Thank you — we'll watch for it",
      "We'll confirm when your Venmo payment lands. " + fulfillmentLine(checkout) + notSaved(placed),
      placed
    );
  }

  async function payInPerson() {
    if (blocked || placing) return;
    setPlacing(true);
    setPlaceErr("");
    const placed = await placeOrder(orderRequest("pickup"));
    setPlacing(false);
    if (!placed.ok) {
      setPlaceErr(`${placed.error || "That didn't go through."} Try again, or call or email Kim.`);
      return;
    }
    const first = checkout.name.trim().split(/\s+/)[0];
    done(
      first ? `Order placed, ${first}` : "Order placed",
      `${fulfillmentLine(checkout)} You'll pay ${money(total)} ${checkout.fulfillment === "event" ? "at the booth" : "at pickup"} — cash, card or Venmo.`,
      placed
    );
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
            <div className="mb-4 grid grid-cols-3 gap-2">
              {MODES.map(({ key, label, note }) => {
                const on = checkout.fulfillment === key;
                return (
                  <button key={key} type="button" aria-pressed={on}
                    onClick={() => updateCheckout({ fulfillment: key })}
                    className={`flex min-h-[60px] flex-col items-center justify-center gap-0.5 rounded-lg border-[1.5px] px-1.5 py-2.5 text-center text-[15px] font-semibold leading-tight
                      ${on ? "border-forest bg-forest text-lime-bright" : "border-line bg-paper text-forest-deep"}`}>
                    {label}
                    <small className={`text-[0.76rem] font-normal ${on ? "text-lime-bright/85" : "text-muted"}`}>{note}</small>
                  </button>
                );
              })}
            </div>

            {checkout.fulfillment === "pickup" && (
              <div className="mb-4 rounded-2xl border border-[#C9DCAE] bg-[#EFF4E7] p-4 text-forest-deep">
                <strong className="mb-1 block">Free pickup in Quincy.</strong>
                Kim will call or email to set a time. Pickup is at {pickupAddress}.
              </div>
            )}

            {checkout.fulfillment === "event" && (
              <div className="mb-4">
                <label className="field mb-2"><span>Which show?</span>
                  <select value={checkout.eventName} onChange={(e) => updateCheckout({ eventName: e.target.value })}>
                    <option value="">Pick a show…</option>
                    {upcoming.map((e) => {
                      const v = eventLabel(e);
                      return <option key={v} value={v}>{e.date} — {e.name}, {e.city} {e.state}</option>;
                    })}
                  </select>
                </label>
                <p className="m-0 text-[0.9rem] text-muted">Kim brings your order to the booth. No shipping charge.</p>
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
                  <span>{checkout.fulfillment === "pickup" ? "Free — pickup" : checkout.fulfillment === "event" ? "Free — at the show" : money(shipping)}</span>
                </li>
              )}
              <li className="mt-1.5 flex justify-between gap-3 border-t-2 border-forest-deep pt-3.5 font-serif text-[1.4rem] font-bold text-forest-deep">
                <span>Total</span><span>{money(total)}</span>
              </li>
            </ul>
          </div>

          {inPerson && (
            <div className="rounded-2xl border border-line bg-paper p-[18px] shadow-soft">
              <h3 className="m-0 mb-1 text-[1.16rem]">
                {checkout.fulfillment === "event" ? "Reserve it — pay at the booth" : "Place it — pay at pickup"}
              </h3>
              <p className="mb-3 mt-0 text-[0.92rem] text-muted">Cash, card or Venmo when you pick it up. Nothing is charged now.</p>
              {blocked && <p className="mb-3 mt-0 rounded-lg bg-cream p-3 text-[0.95rem] text-forest-deep">{blocked}</p>}
              <button type="button" className="btn btn-primary btn-block" onClick={payInPerson} disabled={Boolean(blocked) || placing}>
                {placing ? "Placing order…" : `Place order · ${money(total)}`}
              </button>
              {placeErr && <p role="alert" className="mb-0 mt-3 font-semibold text-warn">{placeErr}</p>}
            </div>
          )}

          {paypalConfigured && (
            <div className="rounded-2xl border border-line bg-paper p-[18px] shadow-soft">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-[#003087] font-serif text-[18px] font-extrabold text-white">P</span>
                <h3 className="m-0 text-[1.16rem]">{inPerson ? "Or pay now with PayPal" : "Pay with PayPal"}</h3>
              </div>
              <PayPalCheckout blocked={blocked} onSuccess={onPaid} />
              <p className="mt-3 text-[0.82rem] text-muted">PayPal checkout may also offer Venmo and card for US customers.</p>
            </div>
          )}

          <VenmoBox onPaid={onVenmoPaid} blocked={blocked} />

          {!inPerson && !onlinePay && (
            <div className="rounded-2xl border border-line bg-cream p-[18px] text-forest-deep">
              <strong className="mb-1 block">Online payment is being set up.</strong>
              To order now, choose <button type="button" className="link-btn" onClick={() => updateCheckout({ fulfillment: "pickup" })}>Pickup</button> or{" "}
              <button type="button" className="link-btn" onClick={() => updateCheckout({ fulfillment: "event" })}>At a show</button> and pay in person,
              or email <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a> to have it shipped.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
