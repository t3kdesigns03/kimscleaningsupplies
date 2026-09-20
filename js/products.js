/* ------------------------------------------------------------------
   Kim's Cleaning Supplies — all site content lives here.

   TO CHANGE A PRICE: edit the `price` number.
   TO ADD A PRODUCT:  copy a block, give it a new `slug`, add an image.
   TO ADD AN EVENT:   add a line to KIMS_EVENTS at the bottom.

   `images` is a list of candidate pictures, best first. Any that is
   missing from the folder is skipped automatically, so it is always
   safe to list a photo you have not downloaded yet.
   ------------------------------------------------------------------ */

/* Facts printed on every cloth product page. */
window.KIMS_CLOTH_FACTS = [
  "70% polyester / 30% polyamide",
  "Heat-melded, non-abrasive",
  "Water only — no sprays",
  "Washable and reusable",
  "15\" × 15\"",
  "Made in USA"
];

window.KIMS_SURFACES = [
  "Glass", "Mirrors", "Windows", "Stainless steel", "Flat stove tops",
  "Granite counters", "Wood", "Tile", "Ceramic", "Computers",
  "Phones and tablets", "LCD and TV screens", "Cars", "Motorcycles",
  "Boats", "Aircraft"
];

window.KIMS_REMOVES = [
  "Oil", "Tar", "Grease", "Dust", "Film", "Fingerprints",
  "Bugs", "Soap scum", "Dirt", "Hair spray", "and bacteria — with water"
];

/* Care copy. `dry` products repeat the dry-only warning. */
window.KIMS_CARE = {
  wet: [
    "Wash in the washer or the dishwasher, with any detergent. Bleach is fine.",
    "No fabric softener — it clogs the fiber and the cloth stops grabbing.",
    "Air dry only."
  ],
  dry: [
    "Use dry only. Do not wet this one.",
    "Wash in the washer with any detergent. Bleach is fine.",
    "No fabric softener — it clogs the fiber and the duster stops grabbing.",
    "Air dry only."
  ]
};

window.KIMS_PRODUCTS = [
  {
    slug: "cloth-2",
    name: "Kim’s Cleaning Cloths — 2 pack",
    short: "The starter pair",
    price: 12.00,
    category: "cloths",
    packOf: 2,
    blurb: "15\" × 15\". Cleans any surface with just water.",
    images: [
      "images/products/cloths-2.svg",
      "images/brand/pack.jpg",
      "images/products/3WE6ZFHZ6L3CZCJ5ADX3BIEV.png",
      "images/products/V7KMXPSLGQLGOUUUODTY4CCT.png"
    ],
    desc: "Two cloths, 15 inches square. Wet one under the tap, wring it out hard, wipe, and walk away — no spray, no paper towels, no streaks to chase. Most people keep one in the kitchen and one in the car and are surprised how long that lasts.",
    bullets: [
      "Enough to try it on your worst window",
      "Same cloth works on glass, granite and a windshield",
      "Washes and comes back to life hundreds of times"
    ],
    care: "wet"
  },
  {
    slug: "cloth-6",
    name: "Kim’s Cleaning Cloths — 6 pack",
    short: "The household bundle",
    price: 24.00,
    category: "cloths",
    packOf: 6,
    blurb: "Best household bundle. Same 15\" cloth, better per-cloth price.",
    images: [
      "images/products/cloths-6.svg",
      "images/brand/pack.jpg",
      "images/products/FCECSWD3IWVIL2JEHUPIU3TD.png"
    ],
    desc: "Six cloths is the size most families settle on — kitchen, bathroom, glass, car, and two in the wash. It is also where the price per cloth drops by a third, which is why it is the one that sells out first at shows.",
    bullets: [
      "One for every room and two in the laundry",
      "Works out to $4 a cloth",
      "The pack people come back for"
    ],
    care: "wet"
  },
  {
    slug: "cloth-18",
    name: "Kim’s Cleaning Cloths — 18 pack",
    short: "Stock up, gift, or outfit a crew",
    price: 54.00,
    category: "cloths",
    packOf: 18,
    blurb: "Stock-up, gift, and commercial pack.",
    images: [
      "images/products/cloths-18.svg",
      "images/brand/pack.jpg",
      "images/products/HC7I2N6D6JKVRNEZ23RJFP3H.png"
    ],
    desc: "Eighteen cloths at $3 each. This is the box cleaning crews, detail shops, churches and schools buy — and the one that turns into a dozen Christmas gifts every December, two cloths to a ribbon.",
    bullets: [
      "$3 a cloth — the best price we do",
      "Bought by detail shops, churches and school groups",
      "Splits into nine two-cloth gifts"
    ],
    care: "wet"
  },
  {
    slug: "grandma-mop",
    name: "Grandma’s Dry Dust Mop",
    short: "Dry floors, no chemicals",
    price: 32.00,
    category: "mops",
    blurb: "Hardwood, tile and laminate. Washable. Patent pending.",
    images: [
      "images/products/mop-grandma.svg",
      "images/products/4EK5OKNWSGAVNIT6IBLVE3WH.png"
    ],
    desc: "A dry dust mop that picks the dust up instead of pushing it into the corner. Hardwood, tile, laminate — run it down the hall in the morning and you are done. The head comes off and goes in the washer. Patent pending.",
    bullets: [
      "Hardwood, tile, laminate and sealed floors",
      "Washable head — no disposable pads to buy",
      "No sprays, no bucket, no waiting for the floor to dry"
    ],
    care: "dry"
  },
  {
    slug: "mop-head",
    name: "Microfiber Mop Head",
    short: "Screw-on refill pad",
    price: 22.00,
    category: "mops",
    blurb: "Hardwood floors. Fits a standard screw-on handle.",
    images: [
      "images/products/mop-head.svg",
      "images/products/MNF2D7WSEOHZVSSTYYJYV7MH.png"
    ],
    desc: "The microfiber head on its own — it screws onto the standard handle you already own. Water is enough for most days. If you want soap on a hardwood floor, half a cup of Murphy's Oil Soap in the bucket is plenty.",
    bullets: [
      "Fits a standard screw-on mop handle",
      "Water only, or half a cup of Murphy's Oil Soap",
      "Washable — back in service the same day"
    ],
    care: "wet"
  },
  {
    slug: "hand-duster",
    name: "Microfiber Hand Duster",
    short: "Dash, shelves, blinds",
    price: 13.00,
    category: "dusters",
    blurb: "Grabs dust instead of pushing it. Handle included.",
    images: [
      "images/products/duster-hand.svg",
      "images/products/A5ATN4JPJJTKB4DQ6JN2RB5O.png"
    ],
    desc: "The little one that lives in the glove box or the kitchen drawer. Microfiber holds a charge, so dust comes with it instead of lifting into the air and landing again an hour later. Shelves, blinds, baseboards, and the dash of a truck.",
    bullets: [
      "Handle included",
      "Vehicle dashes, blinds, shelves, picture frames",
      "Use dry only"
    ],
    care: "dry"
  },
  {
    slug: "high-duster",
    name: "Microfiber High Duster",
    short: "Ceiling fans without the ladder",
    price: 40.00,
    category: "dusters",
    blurb: "Ceiling fans and the spots you need a ladder for.",
    images: [
      "images/products/duster-high.svg",
      "images/products/64NIUDQLZU4JRFFW6BYDZAFV.png",
      "images/products/SVNVXTDAXJJ5GE4MLVIO3B3P.png",
      "images/products/ULZJVS362RKARQVRIEXAHGYC.png"
    ],
    desc: "Extension handle and a head that bends, so you can do the ceiling fan, the top of the cabinets and the vent over the stove with both feet on the floor. The reason people buy this one is usually a ladder they would rather not climb anymore.",
    bullets: [
      "Telescoping extension handle",
      "Flexible head bends over and around fan blades",
      "Use dry only"
    ],
    care: "dry"
  },
  {
    slug: "fluffy-duster",
    name: "Microfiber Fluffy Duster",
    short: "Two sleeves, one handle",
    price: 16.00,
    category: "dusters",
    blurb: "Two washable sleeves plus a telescopic handle.",
    images: [
      "images/products/duster-fluffy.svg",
      "images/products/QNVEEZAQVYGZJ5M4YW6UHQNE.png"
    ],
    desc: "Two fluffy sleeves and a telescopic handle. Use one while the other is in the wash. Good on lampshades, houseplants, tops of doors and anything that a rag would just knock the dust off of.",
    bullets: [
      "Two sleeves included",
      "Telescopic handle for high shelves",
      "Sleeves pull off and go in the washer"
    ],
    care: "dry"
  },
  {
    slug: "hair-towel",
    name: "Kim’s Hair Towel",
    short: "Dries without frizzing",
    price: 15.00,
    category: "hair",
    blurb: "24\" × 38\". Pulls the water, leaves the moisture.",
    images: [
      "images/products/hair-towel.svg",
      "images/products/B4JFA4NLXALZ2332BWL6TGEW.png",
      "images/products/QD5PPQDRZV6HTAFM6QXVLAI4.png"
    ],
    desc: "24 by 38 inches. It pulls the water out of your hair but leaves the moisture in, so hair dries faster without the roughed-up frizz a bath towel gives you. Works the same way on a wool sweater laid flat, and on a wet dog.",
    bullets: [
      "24\" × 38\" — wraps and stays put",
      "Faster drying, less frizz",
      "Also good on sweaters and wet pets"
    ],
    care: "wet",
    optionLabel: "Color",
    options: [
      { value: "Regular", label: "Regular (white)" },
      { value: "Dark Blue", label: "Dark Blue" },
      { value: "Light Blue", label: "Light Blue" },
      { value: "Pink", label: "Pink" },
      { value: "Dark Purple", label: "Dark Purple" },
      { value: "Light Purple", label: "Light Purple" },
      { value: "Green", label: "Green" },
      { value: "Gray", label: "Gray", soldOut: true }
    ]
  }
];

window.KIMS_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "cloths", label: "Cloths" },
  { key: "mops", label: "Mops" },
  { key: "dusters", label: "Dusters" },
  { key: "hair", label: "Hair" }
];

/* ---------------- Fall schedule 2026 ---------------- */
window.KIMS_EVENTS = [
  { date: "Aug 1",      name: "Cantril Dayz Show",                venue: "Dutchmen's Event Center", city: "Cantril",     state: "IA", start: "2026-08-01", end: "2026-08-01" },
  { date: "Aug 19–22",  name: "Central State Shrine Association", venue: "Fairgrounds",             city: "Davenport",   state: "IA", start: "2026-08-19", end: "2026-08-22" },
  { date: "Aug 28–29",  name: "NSRA Quad Cities Street Rod",      venue: "Fairgrounds",             city: "Davenport",   state: "IA", start: "2026-08-28", end: "2026-08-29" },
  { date: "Sep 3–7",    name: "Old Threshers Reunion",            venue: "",                        city: "Mt. Pleasant",state: "IA", start: "2026-09-03", end: "2026-09-07" },
  { date: "Sep 11–13",  name: "Arcola Broom Fest",                venue: "",                        city: "Arcola",      state: "IL", start: "2026-09-11", end: "2026-09-13" },
  { date: "Sep 18–20",  name: "Market in the Villa",              venue: "Fairgrounds",             city: "Centerville", state: "IA", start: "2026-09-18", end: "2026-09-20" },
  { date: "Sep 26–27",  name: "Apple & Pork Fest",                venue: "",                        city: "Clinton",     state: "IL", start: "2026-09-26", end: "2026-09-27" },
  { date: "Oct 3–4",    name: "Spoon River Drive",                venue: "Native Winery",           city: "Lewistown",   state: "IL", start: "2026-10-03", end: "2026-10-04" },
  { date: "Oct 10–11",  name: "Spoon River Drive",                venue: "Native Winery",           city: "Lewistown",   state: "IL", start: "2026-10-10", end: "2026-10-11" },
  { date: "Oct 30–31",  name: "Arthur Home Harvest Expo",         venue: "",                        city: "Arthur",      state: "IL", start: "2026-10-30", end: "2026-10-31" },
  { date: "Nov 7",      name: "Holy Ivy",                         venue: "Bridge View Center",      city: "Ottumwa",     state: "IA", start: "2026-11-07", end: "2026-11-07" },
  { date: "Nov 13–15",  name: "Christmas Market",                 venue: "Oakley Center",           city: "Quincy",      state: "IL", start: "2026-11-13", end: "2026-11-15" },
  { date: "Nov 14",     name: "Catfish Bend Casino",              venue: "",                        city: "Burlington",  state: "IA", start: "2026-11-14", end: "2026-11-14" },
  { date: "Nov 21–22",  name: "QSL",                              venue: "Oakley Center",           city: "Quincy",      state: "IL", start: "2026-11-21", end: "2026-11-22" },
  { date: "Nov 22",     name: "Holiday Extravaganza",             venue: "Fairgrounds",             city: "Springfield", state: "IL", start: "2026-11-22", end: "2026-11-22" },
  { date: "Dec 4–5",    name: "Christmas Market",                 venue: "Macoupin Fairgrounds",    city: "Carlinville", state: "IL", start: "2026-12-04", end: "2026-12-05" }
];

/* ---------------- What customers say ---------------- */
window.KIMS_TESTIMONIALS = [
  { who: "Ed", where: "Pilot",
    text: "I clean aircraft windows hundreds of hours a year — bugs and all. This is all I use now." },
  { who: "Barbara", where: "Burlington, IA",
    text: "I bought my first two cloths at the Burlington home show. They are the only thing I use on my granite and my windows." },
  { who: "Carol", where: "",
    text: "Mirrors, windows, appliances, iPads, every screen in the house. Water only, and no streaking." },
  { who: "Kris", where: "University facilities",
    text: "We have used Eco Easy cloths for about five years. They hold up, we use them campus-wide, and they have been cost-effective." },
  { who: "Tim", where: "",
    text: "Bugs and road grime off the motorcycle, and it does not scratch the paint." },
  { who: "Nancy", where: "",
    text: "My windows have never looked so wonderful." },
  { who: "Connie", where: "",
    text: "They make perfect stocking stuffers. I buy them by the box." },
  { who: "A granddaughter", where: "",
    text: "My grandma used one of these every single day. She asked us to mention it at her funeral, so we did." }
];
