"use client";

import Link from "next/link";
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

  // products sold by color/option get chosen on their page, not quick-added
  if (product.options && product.options.length > 1) {
    return (
      <Link href={`/product/${product.slug}`} className={className}>
        Choose
      </Link>
    );
  }

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
