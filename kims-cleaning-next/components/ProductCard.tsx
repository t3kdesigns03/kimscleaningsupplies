import Link from "next/link";
import SmartImage from "./SmartImage";
import AddToCartButton from "./AddToCartButton";
import { money } from "@/lib/format";
import { SWATCH, hasSwatches, type Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const href = `/product/${product.slug}`;
  return (
    <article className="card group">
      <Link href={href} className="card-media zoomwrap relative" aria-label={product.name}>
        <SmartImage sources={product.images} alt={product.name} className="h-full w-full object-contain" />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-deep/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4 pb-[18px]">
        <h3 className="mb-0.5 text-[1.22rem]">
          <Link href={href} className="text-inherit no-underline hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mb-3 text-[0.94rem] text-muted">{product.blurb}</p>
        {hasSwatches(product) && (
          <div className="mb-3.5 flex items-center gap-1.5" aria-label={`${product.options!.length} colors`}>
            {product.options!.map((o) => (
              <span
                key={o.value}
                title={o.value}
                className="h-4 w-4 rounded-full border border-black/10"
                style={{ background: SWATCH[o.value] }}
              />
            ))}
            <span className="ml-0.5 text-[0.8rem] font-semibold text-muted">{product.options!.length} colors</span>
          </div>
        )}
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
