import { Suspense } from "react";
import Link from "next/link";
import Filters from "@/components/Filters";
import { CheckIcon } from "@/components/Icons";
import PageHero from "@/components/PageHero";

const TRUST = ["Water only", "Made in USA", "Free Quincy pickup", "Washes hundreds of times"];

export const metadata = {
  title: "Shop",
  description:
    "Microfiber cleaning cloths in 2, 6 and 18 packs, wet, dry, and windshield mops, hand and high dusters, scrubbies, and the hair towel. Water only. Made in USA.",
};

export default function ShopPage() {
  return (
    <>
      <PageHero
        eyebrow="The catalog"
        title="Shop"
        blurb="Eleven products. All microfiber. All washable. None of them need a bottle. Pickup in Quincy is free at checkout."
      />

      <section className="bg-wash pb-24 pt-10 md:pb-32 md:pt-14">
        <div className="wrap">
          <ul className="m-0 mb-8 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-[0.95rem] font-semibold text-forest-deep md:mb-10">
            {TRUST.map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 text-grass" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="wrap">
          <Suspense fallback={<p className="text-muted">Loading…</p>}>
            <Filters />
          </Suspense>
        </div>
      </section>

      <section className="section bg-white">
        <div className="wrap narrow text-center">
          <h2>Not sure which pack?</h2>
          <p className="lede mx-auto mb-10">
            Two cloths is enough to prove it to yourself. Six is what most families end up keeping.
            Eighteen is the one that turns into Christmas presents.
          </p>
          <Link href="/product/cloth-6" className="btn btn-primary">Look at the 6-Pack</Link>
        </div>
      </section>
    </>
  );
}
