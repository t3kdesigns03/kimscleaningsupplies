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

  return (
    <>
      <div className="no-scrollbar mb-2 flex gap-2 overflow-x-auto py-1" role="group" aria-label="Filter products">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            aria-pressed={active === c.key}
            onClick={() => pick(c.key)}
            className={`min-h-[44px] flex-none whitespace-nowrap rounded-full border-[1.5px] px-[18px] py-2.5 text-[15px] font-semibold
              ${active === c.key ? "border-forest bg-forest text-lime-bright" : "border-line bg-paper text-forest-deep"}`}
          >
            {c.label}
          </button>
        ))}
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
