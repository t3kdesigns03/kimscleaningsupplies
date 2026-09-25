"use client";

import { usePathname } from "next/navigation";

/* Public header/footer/cart chrome. Hidden on /admin so the staff inbox is
   full-bleed on a phone and never shows the storefront nav. */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return <>{children}</>;
}
