import Link from "next/link";
import SmartImage from "./SmartImage";
import AddToCartButton from "./AddToCartButton";
import { money } from "@/lib/format";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const href = `/product/${product.slug}`;
  return (
    <article className="card">
      <Link href={href} className="card-media" aria-label={product.name}>
        <SmartImage sources={product.images} alt={product.name} className="h-full w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col p-4 pb-[18px]">
        <h3 className="mb-0.5 text-[1.22rem]">
          <Link href={href} className="text-inherit no-underline hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mb-3.5 text-[0.94rem] text-muted">{product.blurb}</p>
        <div className="mt-auto flex items-center gap-3">
          <span className="price text-[1.6rem]">{money(product.price)}</span>
          <span className="ml-auto">
            <AddToCartButton product={product} />
          </span>
        </div>
      </div>
    </article>
  );
}
