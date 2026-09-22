import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { config } from "@/lib/config";

/* Next serves this at /sitemap.xml.
   <loc> must be an ABSOLUTE url — metadataBase does not resolve sitemap
   entries the way it resolves metadata, and Google rejects relative ones
   silently. Everything is built off config.siteUrl so the sitemap follows
   the domain at cutover; see CUTOVER.md. */
const abs = (path: string) => new URL(path, config.siteUrl).toString();

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = (
    [
      { url: "/", changeFrequency: "weekly", priority: 1 },
      { url: "/shop", changeFrequency: "weekly", priority: 0.9 },
      { url: "/about", changeFrequency: "monthly", priority: 0.6 },
      { url: "/events", changeFrequency: "weekly", priority: 0.6 },
      { url: "/contact", changeFrequency: "yearly", priority: 0.4 },
    ] satisfies MetadataRoute.Sitemap
  ).map((p) => ({ ...p, url: abs(p.url), lastModified: now }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: abs(`/product/${p.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...pages, ...productPages];
}
