import type { MetadataRoute } from "next";
import { config } from "@/lib/config";

/* Next serves this at /robots.txt.
   /cart is excluded: it is per-visitor, has nothing to rank for, and only
   spends crawl budget. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/cart" },
    sitemap: `${config.siteUrl}/sitemap.xml`,
    host: config.siteUrl,
  };
}
