import Link from "next/link";
import { productAlt, productDescription, productTitle } from "@/lib/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductGallery from "@/components/ProductGallery";
import ProductBuy from "@/components/ProductBuy";
import { VariantProvider } from "@/components/VariantProvider";
import { money } from "@/lib/format";
import {
  products, getProduct, CARE, CLOTH_FACTS, SURFACES, REMOVES,
} from "@/lib/products";
import { config } from "@/lib/config";
import JsonLd from "@/components/JsonLd";
import PackName from "@/components/PackName";
import { productSchema, breadcrumbSchema } from "@/lib/schema";

/* "a, b, and c" — house style uses the Oxford comma. */
const oxford = (xs: string[]) =>
  xs.length < 3 ? xs.join(" and ") : `${xs.slice(0, -1).join(", ")}, and ${xs[xs.length - 1]}`;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "Not found" };

  // `blurb` is a one-line card caption and reads as a stub in a search
  // result. `desc` is the real copy — trimmed to roughly what Google shows.
  const description = productDescription(p);
  const url = `/product/${p.slug}`;

  return {
    title: { absolute: productTitle(p) },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${p.name} — ${money(p.price)} | Kim’s Cleaning Products`,
      description,
      images: p.images.slice(0, 1),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const cloths = products.filter((x) => x.category === "cloths");
  const isCloth = p.category === "cloths";
  const care = CARE[p.care];
  const dryOnly = p.care === "dry";
  const firstVariant = p.options?.find((o) => !o.soldOut)?.value ?? "";
  const optionImages = Object.fromEntries(
    (p.options ?? []).filter((o) => o.image).map((o) => [o.value, o.image as string])
  );

  return (
    <section className="py-7">
      <JsonLd data={productSchema(p)} />
      <JsonLd data={breadcrumbSchema(p)} />
      <div className="wrap">
        <p className="mb-4 text-[0.92rem]">
          <Link href="/shop" className="inline-flex min-h-[44px] items-center">&larr; Back to the shop</Link>
        </p>

        <VariantProvider initial={firstVariant}>
        <div className="grid items-start gap-6 pb-24 md:grid-cols-2 md:gap-9 lg:pb-5">
          <ProductGallery sources={p.images} alt={productAlt(p.name)} optionImages={optionImages} />

          <div>
            <h1 className="mb-0.5 text-[clamp(1.75rem,6vw,2.7rem)]"><PackName name={p.name} /></h1>
            <span className="price block text-[2rem]">{money(p.price)}</span>
            <p className="mt-3 text-muted">{p.blurb}</p>
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
                            {cur ? <strong>{c.packOf}-Pack</strong> : <Link href={`/product/${c.slug}`} className="-my-2 inline-block py-2">{c.packOf}-Pack</Link>}
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
                <p className="mt-3 text-[0.9rem] text-muted"><strong>Cleans:</strong> {oxford(SURFACES)}.</p>
                <p className="mt-1.5 text-[0.9rem] text-muted"><strong>Removes:</strong> {oxford(REMOVES)}.</p>
              </div>
            )}

            <p className="mt-[18px] text-[0.9rem] text-muted">
              Shipping is a flat {money(config.flatShipping)}, or choose free pickup in Quincy at checkout.
            </p>
          </div>
        </div>
        </VariantProvider>
      </div>
    </section>
  );
}
