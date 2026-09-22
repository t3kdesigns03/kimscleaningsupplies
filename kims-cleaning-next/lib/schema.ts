/* ------------------------------------------------------------------
   Structured data (schema.org / JSON-LD).

   This is what lets Google show a price and "In stock" under the search
   result instead of a plain blue link. Everything is derived from the real
   product list and config — never hand-write a number here, and never add
   an aggregateRating we cannot back with real reviews. Google penalises
   invented review markup.
   ------------------------------------------------------------------ */
import { config } from "./config";
import type { Product } from "./products";

const abs = (path: string) => new URL(path, config.siteUrl).toString();

export const ORG_ID = `${config.siteUrl}/#organization`;

/** The business itself. Emitted once, from the root layout. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": ORG_ID,
    name: config.brand,
    url: config.siteUrl,
    description:
      "Eco Easy microfiber cloths, dust mops, dusters and hair towels that clean with water only. Made in USA.",
    logo: abs("/images/brand/logo-mark-512.png"),
    image: abs("/images/brand/hero-earth-full.jpg"),
    email: config.contactEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: config.pickupStreet,
      addressLocality: "Quincy",
      addressRegion: "IL",
      postalCode: "62305",
      addressCountry: "US",
    },
    areaServed: "US",
  };
}

/** One product. Emitted from the product page. */
export function productSchema(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.desc,
    image: p.images.map(abs),
    sku: p.slug,
    category: p.category,
    brand: { "@type": "Brand", name: config.brand },
    offers: {
      "@type": "Offer",
      url: abs(`/product/${p.slug}`),
      price: p.price.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ORG_ID },
    },
  };
}

/** Home > Shop > <product>, so search results show a path instead of a URL. */
export function breadcrumbSchema(p: Product) {
  const crumbs = [
    { name: "Home", item: config.siteUrl },
    { name: "Shop", item: abs("/shop") },
    { name: p.name, item: abs(`/product/${p.slug}`) },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.item,
    })),
  };
}
