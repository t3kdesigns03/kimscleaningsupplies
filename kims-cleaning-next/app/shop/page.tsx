import { Suspense } from "react";
import Link from "next/link";
import Filters from "@/components/Filters";
import { CheckIcon } from "@/components/Icons";
import PageHero from "@/components/PageHero";

const TRUST = ["Water only", "Made in USA", "Free Quincy pickup", "Washes hundreds of times"];

export const metadata = {
  title: "Shop",
  description:
    "Microfiber cleaning cloths in 2, 6 and 18 packs, wet and dry mops, hand and high dusters, and the hair towel. Water only. Made in USA.",
};

export default function ShopPage() {
  return (
    <>
      <PageHero
        eyebrow="The catalog"
        title="Shop"
        blurb="Ten products. All microfiber. All washable. None of them need a bottle. Pickup in Quincy is free at checkout."
      />

      <section className="border-b border-line bg-botanical-soft py-4">
        <div className="wrap">
          <ul className="m-0 flex flex-wrap gap-2 p-0">
            {TRUST.map((t) => (
              <li key={t} className="chip">
                <CheckIcon className="h-4 w-4 text-grass" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-8">
        <div className="wrap">
          <Suspense fallback={<p className="text-muted">Loading…</p>}>
            <Filters />
          </Suspense>
        </div>
      </section>

      <section className="bg-cream py-11 md:py-14">
        <div className="wrap narrow text-center">
          <h2>Not sure which pack?</h2>
          <p className="text-muted">
            Two cloths is enough to prove it to yourself. Six is what most families end up keeping.
            Eighteen is the one that turns into Christmas presents.
          </p>
          <Link href="/product/cloth-6" className="btn btn-ghost">Look at the 6-Pack</Link>
        </div>
      </section>
    </>
  );
}
