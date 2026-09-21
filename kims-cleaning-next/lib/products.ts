/* ------------------------------------------------------------------
   All product content lives here.

   TO CHANGE A PRICE: edit the `price` number.
   TO ADD A PRODUCT:  copy a block, give it a new `slug`, add an image.

   `images` is an ordered list of candidate pictures, best first. Any
   file that is missing from /public is skipped automatically at
   runtime, so it is always safe to list a photo you have not added
   yet — you will never get a broken thumbnail. Real photos come first;
   the .svg clipart is only a last-resort fallback.
   ------------------------------------------------------------------ */

export type Category = "cloths" | "mops" | "dusters" | "hair";
export type Care = "wet" | "dry";

export interface ProductOption {
  value: string;
  label: string;
  soldOut?: boolean;
  image?: string;
}

export interface Product {
  slug: string;
  name: string;
  short: string;
  price: number;
  category: Category;
  packOf?: number;
  blurb: string;
  images: string[];
  desc: string;
  bullets: string[];
  care: Care;
  optionLabel?: string;
  options?: ProductOption[];
}

/* Facts printed on every cloth product page. */
export const CLOTH_FACTS = [
  "70% polyester / 30% polyamide",
  "Heat-melded, non-abrasive",
  "Water only — no sprays",
  "Washable and reusable",
  '15" × 15"',
  "Made in USA",
];

export const SURFACES = [
  "Glass", "Mirrors", "Windows", "Stainless steel", "Flat stove tops",
  "Granite counters", "Wood", "Tile", "Ceramic", "Computers",
  "Phones and tablets", "LCD and TV screens", "Cars", "Motorcycles",
  "Boats", "Aircraft",
];

export const REMOVES = [
  "Oil", "Tar", "Grease", "Dust", "Film", "Fingerprints",
  "Bugs", "Soap scum", "Dirt", "Hair spray", "and bacteria — with water",
];

export const CARE: Record<Care, string[]> = {
  wet: [
    "Wash in the washer or the dishwasher, with any detergent. Bleach is fine.",
    "No fabric softener — it clogs the fiber and the cloth stops grabbing.",
    "Air dry only.",
  ],
  dry: [
    "Use dry only. Do not wet this one.",
    "Wash in the washer with any detergent. Bleach is fine.",
    "No fabric softener — it clogs the fiber and the duster stops grabbing.",
    "Air dry only.",
  ],
};

export const products: Product[] = [
  {
    slug: "cloth-2",
    name: "Kim’s Cleaning Cloths — 2 pack",
    short: "The starter pair",
    price: 12.0,
    category: "cloths",
    packOf: 2,
    blurb: '15" × 15". Cleans any surface with just water.',
    images: [
      "/images/products/cloths-colors.webp",
      "/images/products/cloths-card.webp",
      "/images/products/cloths-detail.webp",
      "/images/products/cloths-2.svg",
    ],
    desc: "Two cloths, 15 inches square. Wet one under the tap, wring it out hard, wipe, and walk away — no spray, no paper towels, no streaks to chase. Most people keep one in the kitchen and one in the car and are surprised how long that lasts.",
    bullets: [
      "Enough to try it on your worst window",
      "Same cloth works on glass, granite and a windshield",
      "Washes and comes back to life hundreds of times",
    ],
    care: "wet",
  },
  {
    slug: "cloth-6",
    name: "Kim’s Cleaning Cloths — 6 pack",
    short: "The household bundle",
    price: 24.0,
    category: "cloths",
    packOf: 6,
    blurb: 'Best household bundle. Same 15" cloth, better per-cloth price.',
    images: [
      "/images/products/cloths-colors.webp",
      "/images/products/cloths-detail.webp",
      "/images/products/cloths-card.webp",
      "/images/products/cloths-6.svg",
    ],
    desc: "Six cloths is the size most families settle on — kitchen, bathroom, glass, car, and two in the wash. It is also where the price per cloth drops by a third, which is why it is the one that sells out first at shows.",
    bullets: [
      "One for every room and two in the laundry",
      "Works out to $4 a cloth",
      "The pack people come back for",
    ],
    care: "wet",
  },
  {
    slug: "cloth-18",
    name: "Kim’s Cleaning Cloths — 18 pack",
    short: "Stock up, gift, or outfit a crew",
    price: 54.0,
    category: "cloths",
    packOf: 18,
    blurb: "Stock-up, gift, and commercial pack.",
    images: [
      "/images/products/cloths-colors.webp",
      "/images/products/cloths-grey.webp",
      "/images/products/cloths-card.webp",
      "/images/products/cloths-18.svg",
    ],
    desc: "Eighteen cloths at $3 each. This is the box cleaning crews, detail shops, churches and schools buy — and the one that turns into a dozen Christmas gifts every December, two cloths to a ribbon.",
    bullets: [
      "$3 a cloth — the best price we do",
      "Bought by detail shops, churches and school groups",
      "Splits into nine two-cloth gifts",
    ],
    care: "wet",
  },
  {
    slug: "grandma-mop",
    name: "Grandma’s Dry Dust Mop",
    short: "Dry floors, no chemicals",
    price: 32.0,
    category: "mops",
    blurb: "Hardwood, tile and laminate. Washable. Patent pending.",
    images: [
      "/images/products/grandmas-dry-mop.webp",
      "/images/products/grandmas-dry-mop-2.webp",
      "/images/products/mop-grandma.svg",
    ],
    desc: "A dry dust mop that picks the dust up instead of pushing it into the corner. Hardwood, tile, laminate — run it down the hall in the morning and you are done. The head comes off and goes in the washer. Patent pending.",
    bullets: [
      "Hardwood, tile, laminate and sealed floors",
      "Washable head — no disposable pads to buy",
      "No sprays, no bucket, no waiting for the floor to dry",
    ],
    care: "dry",
  },
  {
    slug: "mop-head",
    name: "Microfiber Mop Head",
    short: "Screw-on refill pad",
    price: 22.0,
    category: "mops",
    blurb: "Hardwood floors. Fits a standard screw-on handle.",
    images: [
      "/images/products/mop-pads2.webp",
      "/images/products/mop-head.svg",
    ],
    desc: "The microfiber head on its own — it screws onto the standard handle you already own. Water is enough for most days. If you want soap on a hardwood floor, half a cup of Murphy's Oil Soap in the bucket is plenty.",
    bullets: [
      "Fits a standard screw-on mop handle",
      "Water only, or half a cup of Murphy's Oil Soap",
      "Washable — back in service the same day",
    ],
    care: "wet",
  },
  {
    slug: "hand-duster",
    name: "Microfiber Hand Duster",
    short: "Dash, shelves, blinds",
    price: 13.0,
    category: "dusters",
    blurb: "Grabs dust instead of pushing it. Handle included.",
    images: [
      "/images/products/duster-hand.webp",
      "/images/products/duster-hand.svg",
    ],
    desc: "The little one that lives in the glove box or the kitchen drawer. Microfiber holds a charge, so dust comes with it instead of lifting into the air and landing again an hour later. Shelves, blinds, baseboards, and the dash of a truck.",
    bullets: [
      "Handle included",
      "Vehicle dashes, blinds, shelves, picture frames",
      "Use dry only",
    ],
    care: "dry",
  },
  {
    slug: "high-duster",
    name: "Microfiber High Duster",
    short: "Ceiling fans without the ladder",
    price: 40.0,
    category: "dusters",
    blurb: "Ceiling fans and the spots you need a ladder for.",
    images: [
      "/images/products/duster-frame.webp",
      "/images/products/duster-high.svg",
    ],
    desc: "Extension handle and a head that bends, so you can do the ceiling fan, the top of the cabinets and the vent over the stove with both feet on the floor. The reason people buy this one is usually a ladder they would rather not climb anymore.",
    bullets: [
      "Telescoping extension handle",
      "Flexible head bends over and around fan blades",
      "Use dry only",
    ],
    care: "dry",
  },
  {
    slug: "fluffy-duster",
    name: "Microfiber Fluffy Duster",
    short: "Two sleeves, one handle",
    price: 16.0,
    category: "dusters",
    blurb: "Two washable sleeves plus a telescopic handle.",
    images: [
      "/images/products/duster-round.webp",
      "/images/products/duster-fluffy.svg",
    ],
    desc: "Two fluffy sleeves and a telescopic handle. Use one while the other is in the wash. Good on lampshades, houseplants, tops of doors and anything that a rag would just knock the dust off of.",
    bullets: [
      "Two sleeves included",
      "Telescopic handle for high shelves",
      "Sleeves pull off and go in the washer",
    ],
    care: "dry",
  },
  {
    slug: "hair-towel",
    name: "Kim’s Hair Towel",
    short: "Dries without frizzing",
    price: 15.0,
    category: "hair",
    blurb: '24" × 38". Pulls the water, leaves the moisture.',
    images: [
      "/images/products/hair-blue.webp",
      "/images/products/hair-lightblue.webp",
      "/images/products/hair-green.webp",
      "/images/products/hair-yellow.webp",
      "/images/products/hair-pink.webp",
      "/images/products/hair-lightpurple.webp",
      "/images/products/hair-darkpurple.webp",
      "/images/products/hair-towel.svg",
    ],
    desc: "24 by 38 inches. It pulls the water out of your hair but leaves the moisture in, so hair dries faster without the roughed-up frizz a bath towel gives you. Works the same way on a wool sweater laid flat, and on a wet dog. Seven colors to choose from.",
    bullets: [
      '24" × 38" — wraps and stays put',
      "Faster drying, less frizz",
      "Seven colors — also good on sweaters and wet pets",
    ],
    care: "wet",
    optionLabel: "Color",
    options: [
      { value: "Blue", label: "Blue", image: "/images/products/hair-blue.webp" },
      { value: "Light Blue", label: "Light Blue", image: "/images/products/hair-lightblue.webp" },
      { value: "Green", label: "Green", image: "/images/products/hair-green.webp" },
      { value: "Yellow", label: "Yellow", image: "/images/products/hair-yellow.webp" },
      { value: "Pink", label: "Pink", image: "/images/products/hair-pink.webp" },
      { value: "Light Purple", label: "Light Purple", image: "/images/products/hair-lightpurple.webp" },
      { value: "Dark Purple", label: "Dark Purple", image: "/images/products/hair-darkpurple.webp" },
    ],
  },
];

/* Color swatch chips (hex) for products sold by color. Keyed by option value. */
export const SWATCH: Record<string, string> = {
  Blue: "#1E49C4",
  "Light Blue": "#8FB8D8",
  Green: "#2E8B72",
  Yellow: "#ECC53F",
  Pink: "#E88AA5",
  "Light Purple": "#B4A0D6",
  "Dark Purple": "#5B3F86",
};

/* The image for a chosen variant, if that option carries one. */
export function variantImage(p: Product, variant?: string): string | undefined {
  if (!variant) return undefined;
  return p.options?.find((o) => o.value === variant)?.image;
}

/* Ordered image list with the chosen variant's photo pulled to the front. */
export function imagesFor(p: Product, variant?: string): string[] {
  const vi = variantImage(p, variant);
  return vi ? [vi, ...p.images.filter((s) => s !== vi)] : p.images;
}

/* True when a product is sold in colors we can render as swatches. */
export function hasSwatches(p: Product): boolean {
  return !!p.options && p.options.every((o) => o.value in SWATCH);
}

export const CATEGORIES: { key: "all" | Category; label: string }[] = [
  { key: "all", label: "All" },
  { key: "cloths", label: "Cloths" },
  { key: "mops", label: "Mops" },
  { key: "dusters", label: "Dusters" },
  { key: "hair", label: "Hair" },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
