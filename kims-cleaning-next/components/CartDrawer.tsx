"use client";

/* ------------------------------------------------------------------
   Slide-in cart drawer. Opens whenever something is added, so the
   shopper never leaves the page they're on. Full checkout still
   lives at /cart — this is the quick review + adjust panel.
   ------------------------------------------------------------------ */

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "./CartProvider";
import SmartImage from "./SmartImage";
import { CloseIcon, EmptyCartIcon } from "./Icons";
import { money } from "@/lib/format";
import { config } from "@/lib/config";

export default function CartDrawer() {
  const {
    ready, lines, count, subtotal, drawerOpen, closeDrawer, setQty, remove,
  } = useCart();

  // lock body scroll + close on Esc while open
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, closeDrawer]);

  const empty = ready && lines.length === 0;

  return (
    <div
      className={`fixed inset-0 z-[80] ${drawerOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!drawerOpen}
    >
      {/* scrim */}
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 bg-forest-deep/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className={`absolute right-0 top-0 flex h-full w-[min(94vw,420px)] flex-col bg-paper shadow-[-14px_0_40px_rgba(21,63,26,0.18)]
          transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <header className="flex items-center gap-3 border-b border-line px-5 py-4">
          <h2 className="m-0 font-serif text-[1.35rem] text-forest-deep">
            Your cart{count > 0 && <span className="text-muted"> · {count}</span>}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-xl text-forest-deep hover:bg-grass/10"
          >
            <CloseIcon />
          </button>
        </header>

        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <EmptyCartIcon className="h-16 w-16 text-line" />
            <p className="m-0 text-muted">Your cart is empty.</p>
            <Link href="/shop" onClick={closeDrawer} className="btn btn-primary">
              Shop the cloths
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="m-0 flex list-none flex-col gap-4 p-0">
                {lines.map((l) => (
                  <li key={l.slug + "::" + l.variant} className="flex gap-3.5">
                    <Link
                      href={`/product/${l.slug}`}
                      onClick={closeDrawer}
                      className="block h-[76px] w-[76px] flex-none overflow-hidden rounded-xl border border-line"
                      style={{ background: "linear-gradient(170deg,#FFFDF8,#ECEAD2)" }}
                      aria-label={l.name}
                    >
                      <SmartImage sources={l.product.images} alt={l.name} className="h-full w-full object-cover" />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link
                        href={`/product/${l.slug}`}
                        onClick={closeDrawer}
                        className="font-semibold leading-tight text-forest-deep no-underline hover:underline"
                      >
                        {l.name}
                      </Link>
                      {l.variant && <span className="text-[0.85rem] text-muted">{l.variant}</span>}

                      <div className="mt-auto flex items-center gap-2 pt-2">
                        <div className="inline-flex items-stretch overflow-hidden rounded-full border border-line">
                          <button
                            type="button"
                            aria-label="One fewer"
                            onClick={() => setQty(l.slug, l.variant, l.qty - 1)}
                            className="h-8 w-8 text-[18px] leading-none text-forest-deep hover:bg-grass/10"
                          >
                            &minus;
                          </button>
                          <span className="flex w-8 items-center justify-center text-[15px] font-semibold text-ink">
                            {l.qty}
                          </span>
                          <button
                            type="button"
                            aria-label="One more"
                            onClick={() => setQty(l.slug, l.variant, l.qty + 1)}
                            className="h-8 w-8 text-[18px] leading-none text-forest-deep hover:bg-grass/10"
                          >
                            +
                          </button>
                        </div>
                        <span className="price ml-auto text-[1.05rem]">{money(l.total)}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(l.slug, l.variant)}
                        className="mt-1 self-start text-[0.82rem] text-muted underline hover:text-warn"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-line px-5 pb-5 pt-4">
              <div className="mb-1 flex items-baseline justify-between">
                <span className="font-semibold text-forest-deep">Subtotal</span>
                <span className="price text-[1.3rem]">{money(subtotal)}</span>
              </div>
              <p className="mb-3.5 mt-0 text-[0.85rem] text-muted">
                {config.flatShipping
                  ? `Flat $${config.flatShipping.toFixed(2)} shipping, or free local pickup — chosen at checkout.`
                  : "Shipping chosen at checkout."}
              </p>
              <Link href="/cart" onClick={closeDrawer} className="btn btn-primary btn-block">
                Checkout
              </Link>
              <button
                type="button"
                onClick={closeDrawer}
                className="mt-2 block w-full text-center text-[0.9rem] font-semibold text-grass underline"
              >
                Keep shopping
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
