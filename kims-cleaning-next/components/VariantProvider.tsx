"use client";

/* Shares the selected variant (e.g. hair-towel color) between the buy
   panel and the gallery on a product page. Optional: components call
   useVariant() and simply get null when no provider is present. */

import { createContext, useContext, useState } from "react";

interface VariantCtx {
  variant: string;
  setVariant: (v: string) => void;
}

const Ctx = createContext<VariantCtx | null>(null);

export function VariantProvider({
  initial = "",
  children,
}: {
  initial?: string;
  children: React.ReactNode;
}) {
  const [variant, setVariant] = useState(initial);
  return <Ctx.Provider value={{ variant, setVariant }}>{children}</Ctx.Provider>;
}

export function useVariant(): VariantCtx | null {
  return useContext(Ctx);
}
