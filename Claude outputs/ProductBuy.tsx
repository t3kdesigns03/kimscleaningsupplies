"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { toast } from "./Toast";
import { money } from "@/lib/format";
import type { Product } from "@/lib/products";

const SWATCH: Record<string, string> = {
  Regular: "#F3F2E8",
  "Dark Blue": "#26456E",
  "Light Blue": "#86B6D8",
  Pink: "#E7A6BC",
  "Dark Purple": "#5A3E77",
  "Light Purple": "#B7A3D6",
  Green: "#5C9A3A",
  Gray: "#9AA0A6",
};

export default function ProductBuy({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const firstInStock = product.options?.find((o) => !o.soldOut)?.value ?? "";
  const [variant, setVariant] = useState(firstInStock);
  const hasSwatches = product.options?.every((o) => o.value in SWATCH) ?? false;

  const clamp = (n: number) => Math.min(99, Math.max(1, Math.floor(n) || 1));

  function addToCart() {
    add(product.slug, qty, variant);
    toast(qty > 1 ? `${qty} added to cart` : `${product.name} added to cart`);
  }

  return (
    <>
      {product.options && hasSwatches && (
        <div className="mb-5">
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-[0.95rem] font-semibold text-forest-deep">{product.optionLabel || "Color"}</span>
            <span className="text-[0.9rem] text-muted">{variant}</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {product.options.map((o) => {
              const sel = o.value === variant;
              return (
                <button
                  key={o.value}
                  type="button"
                  title={o.value + (o.soldOut ? " — out of stock" : "")}
                  aria-label={o.value + (o.soldOut ? " (out of stock)" : "")}
                  aria-pressed={sel}
                  disabled={o.soldOut}
                  onClick={() => !o.soldOut && setVariant(o.value)}
                  className={`relative h-9 w-9 rounded-full border transition
                    ${sel ? "ring-2 ring-forest ring-offset-2 ring-offset-paper border-transparent" : "border-line"}
                    ${o.soldOut ? "cursor-not-allowed opacity-50" : "hover:scale-105"}`}
                  style={{ background: SWATCH[o.value] }}
                >
                  {o.soldOut && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="h-[1.5px] w-[120%] -rotate-45 bg-warn/70" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {product.options && !hasSwatches && (
        <label className="field">
          <span>{product.optionLabel || "Option"}</span>
          <select value={variant} onChange={(e) => setVariant(e.target.value)}>
            {product.options.map((o) => (
              <option key={o.value} value={o.value} disabled={o.soldOut}>
                {o.label}
                {o.soldOut ? " — out of stock" : ""}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="mb-[18px] flex flex-wrap items-center gap-3">
        <div className="inline-flex items-stretch overflow-hidden rounded-full border-[1.5px] border-line bg-paper">
          <button type="button" aria-label="One fewer" onClick={() => setQty(clamp(qty - 1))}
            className="h-[50px] w-[50px] text-[22px] text-forest-deep hover:bg-grass/10">
            &minus;
          </button>
          <input
            type="number" min={1} max={99} value={qty} aria-label="Quantity"
            onChange={(e) => setQty(clamp(Number(e.target.value)))}
            className="w-[54px] border-0 bg-transparent text-center text-[17px] font-semibold text-ink [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button type="button" aria-label="One more" onClick={() => setQty(clamp(qty + 1))}
            className="h-[50px] w-[50px] text-[22px] text-forest-deep hover:bg-grass/10">
            +
          </button>
        </div>
        <button type="button" onClick={addToCart} className="btn btn-primary flex-1 basis-[200px]">
          Add to cart
        </button>
      </div>

      {/* sticky mobile bar */}
      <div className="fixed inset-x-0 bottom-0 z-[55] flex items-center gap-3 border-t border-line bg-paper px-4 py-2.5 shadow-[0_-6px_22px_rgba(21,63,26,0.10)] lg:hidden"
        style={{ paddingBottom: "calc(10px + env(safe-area-inset-bottom,0px))" }}>
        <span className="price text-[1.32rem]">{money(product.price * qty)}</span>
        <button type="button" onClick={addToCart} className="btn btn-primary ml-auto max-w-[62%] flex-1">
          Add to cart
        </button>
      </div>
    </>
  );
}
