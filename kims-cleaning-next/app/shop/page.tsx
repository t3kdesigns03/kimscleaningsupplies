import { Suspense } from "react";
import Link from "next/link";
import Filters from "@/components/Filters";
import { CheckIcon } from "@/components/Icons";

const TRUST = ["Water only", "Made in USA", "Free Quincy pickup", "Washable 100s of times"];

export const metadata = {
  title: "Shop",
  description:
    "Microfiber cleaning cloths in 2, 6 and 18 packs, dry dust mops, hand and high dusters, and the hair towel. Water only. Made in USA.",
};

export default function ShopPage() {
  return (
    <>
      <section className="bg-botanical-soft py-9 md:py-12">
        <div className="wrap">
          <span className="eyebrow">Everything Kim sells</span>
          <h1>Shop</h1>
          <p className="max-w-[54ch] text-muted">
            Nine things. All of them microfiber, all of them washable, and none of them need a bottle
            of anything. Pickup in Quincy is free at checkout.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2 p-0">
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
          <Link href="/product/cloth-6" className="btn btn-ghost">Look at the 6-pack</Link>
        </div>
      </section>
    </>
  );
}
