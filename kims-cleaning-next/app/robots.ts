import type { MetadataRoute } from "next";
import { config } from "@/lib/config";

/* Next serves this at /robots.txt.
   /cart is excluded: it is per-visitor, has nothing to rank for, and only
   spends crawl budget. /admin and /api are staff/server only. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/cart", "/admin", "/api/"] },
    sitemap: `${config.siteUrl}/sitemap.xml`,
    host: config.siteUrl,
  };
}
