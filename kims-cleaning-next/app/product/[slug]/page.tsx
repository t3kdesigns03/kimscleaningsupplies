import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductGallery from "@/components/ProductGallery";
import ProductBuy from "@/components/ProductBuy";
import { money } from "@/lib/format";
import {
  products, getProduct, CARE, CLOTH_FACTS, SURFACES, REMOVES,
} from "@/lib/products";
import { config } from "@/lib/config";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProduct(params.slug);
  if (!p) return { title: "Not found" };
  return { title: p.name, description: p.blurb };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const p = getProduct(params.slug);
  if (!p) notFound();

  const cloths = products.filter((x) => x.category === "cloths");
  const isCloth = p.category === "cloths";
  const care = CARE[p.care];
  const dryOnly = p.care === "dry";

  return (
    <section className="py-7">
      <div className="wrap">
        <p className="mb-4 text-[0.92rem]">
          <Link href="/shop">&larr; Back to the shop</Link>
        </p>

        <div className="grid items-start gap-6 pb-24 md:grid-cols-2 md:gap-9 lg:pb-5">
          <ProductGallery sources={p.images} alt={p.name} />

          <div>
            <h1 className="mb-0.5 text-[clamp(1.75rem,6vw,2.7rem)]">{p.name}</h1>
            <span className="price block text-[2rem]">{money(p.price)}</span>
            <p className="mt-2.5 text-muted">{p.blurb}</p>
            <p>{p.desc}</p>

            <ul className="facts">
              {p.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>

            <hr className="my-8 border-0 border-t border-line" />

            <ProductBuy product={p} />

            {isCloth && (
              <div className="panel mt-4">
                <h3 className="mb-1.5 text-[1.1rem]">Which pack is the better buy?</h3>
                <table className="mt-2 w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b border-line py-2.5 pr-2 text-left text-[0.95rem] font-bold text-forest-deep">Pack</th>
                      <th className="border-b border-line py-2.5 px-2 text-left text-[0.95rem] font-bold text-forest-deep">Price</th>
                      <th className="border-b border-line py-2.5 pl-2 text-right text-[0.95rem] font-bold text-forest-deep">Per cloth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cloths.map((c) => {
                      const each = c.price / (c.packOf || 1);
                      const best = c.slug === "cloth-18";
                      const cur = c.slug === p.slug;
                      return (
                        <tr key={c.slug} className={cur ? "bg-lime/10" : ""}>
                          <td className="border-b border-line py-2.5 pr-2 text-[0.95rem]">
                            {cur ? <strong>{c.packOf} pack</strong> : <Link href={`/product/${c.slug}`}>{c.packOf} pack</Link>}
                          </td>
                          <td className="border-b border-line py-2.5 px-2 text-[0.95rem]">{money(c.price)}</td>
                          <td className="border-b border-line py-2.5 pl-2 text-right text-[0.95rem]">
                            {money(each)}
                            {best && <span className="ml-1.5 inline-block rounded-full bg-leaf px-2 py-0.5 align-[2px] text-[0.72rem] font-bold text-paper">Best value</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className={`panel mt-4 ${dryOnly ? "panel-warn" : ""}`}>
              <h3 className={`mb-1.5 text-[1.1rem] ${dryOnly ? "text-warn" : ""}`}>Looking after it</h3>
              <ul className="facts">
                {care.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>

            {isCloth && (
              <div className="panel mt-4">
                <h3 className="mb-1.5 text-[1.1rem]">The cloth itself</h3>
                <ul className="facts">
                  {CLOTH_FACTS.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <p className="mt-3 text-[0.9rem] text-muted"><strong>Cleans:</strong> {SURFACES.join(", ")}.</p>
                <p className="mt-1.5 text-[0.9rem] text-muted"><strong>Removes:</strong> {REMOVES.join(", ")}.</p>
              </div>
            )}

            <p className="mt-[18px] text-[0.9rem] text-muted">
              Shipping is a flat {money(config.flatShipping)}, or choose free pickup in Quincy at checkout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
