"use client";

import { useCart } from "./CartProvider";
import type { Product } from "@/lib/products";

export default function AddToCartButton({
  product,
  className = "btn btn-primary btn-sm",
  label = "Add",
}: {
  product: Product;
  className?: string;
  label?: string;
}) {
  const { add, openDrawer } = useCart();
  const variant = product.options ? (product.options.find((o) => !o.soldOut)?.value ?? "") : "";
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        add(product.slug, 1, variant);
        openDrawer();
      }}
    >
      {label}
    </button>
  );
}
