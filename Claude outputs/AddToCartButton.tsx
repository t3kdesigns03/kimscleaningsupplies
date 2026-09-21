"use client";

import { useCart } from "./CartProvider";
import { toast } from "./Toast";
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
  const { add } = useCart();
  const variant = product.options ? product.options[0].value : "";
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        add(product.slug, 1, variant);
        toast(`${product.name} added to cart`);
      }}
    >
      {label}
    </button>
  );
}
