"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { products, CATEGORIES } from "@/lib/products";

export default function Filters() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initial = params.get("filter") || "all";
  const valid = CATEGORIES.some((c) => c.key === initial) ? initial : "all";
  const [active, setActive] = useState(valid);

  const shown = products.filter((p) => active === "all" || p.category === active);

  function pick(key: string) {
    setActive(key);
    const url = key === "all" ? pathname : `${pathname}?filter=${key}`;
    router.replace(url, { scroll: false });
  }

  const countFor = (key: string) =>
    products.filter((p) => key === "all" || p.category === key).length;

  return (
    <>
      <div className="no-scrollbar sticky top-[56px] z-40 -mx-4 mb-5 flex gap-2 overflow-x-auto border-b border-forest-deep/10 bg-wash/95 px-4 py-2.5 backdrop-blur sm:-mx-7 sm:px-7 md:top-[64px] lg:top-[96px]"
        role="group" aria-label="Filter products">
        {CATEGORIES.map((c) => {
          const on = active === c.key;
          return (
            <button
              key={c.key}
              type="button"
              aria-pressed={on}
              onClick={() => pick(c.key)}
              className={`flex min-h-[44px] flex-none items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] px-[18px] py-2.5 text-[15px] font-semibold transition active:scale-95
                ${on ? "border-forest bg-forest text-lime-bright" : "border-line bg-paper text-forest-deep hover:border-grass"}`}
            >
              {c.label}
              <span className={`text-[0.8rem] font-bold ${on ? "text-lime-bright/80" : "text-muted"}`}>{countFor(c.key)}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      {shown.length === 0 && <p className="py-8 text-muted">Nothing in that group yet.</p>}
    </>
  );
}
