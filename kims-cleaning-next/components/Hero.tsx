import Link from "next/link";

/* Full-bleed photographic apex. The glass-globe banner is the background and
   the globe is the one object on the right; a forest scrim on the left keeps
   the headline crisp. Left column is deliberately sparse: eyebrow, headline,
   one line, one pill. */
export default function Hero() {
  return (
    <section aria-label="Kim's Cleaning Products" className="relative isolate overflow-hidden bg-forest-deep">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/brand/hero-banner.jpg"
        alt="A glass globe of the Earth resting among ferns and green moss"
        fetchPriority="high"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-[82%_50%]"
      />
      {/* scrims: horizontal for desktop text, vertical lift for phones */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep/95 via-forest-deep/62 to-forest-deep/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep/80 to-forest-deep/20 md:from-forest-deep/15 md:to-transparent" />

      <div className="mx-auto flex min-h-[520px] max-w-site items-center px-4 py-20 sm:px-7 md:min-h-[660px] md:py-24">
        <div className="w-full animate-rise md:max-w-[50%]">
          <span className="text-[0.74rem] font-bold uppercase tracking-[0.18em] text-[#EAD24A]">
            Eco Easy Microfiber · Made in USA
          </span>
          <h1 className="mb-4 mt-4 text-paper drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
            Cleans with just water.
          </h1>
          <p className="mb-9 max-w-[36ch] text-balance text-[1.15rem] font-semibold text-[#DCE9CF] sm:text-[1.3rem]">
            Wet it. Wring it. Wipe it. Walk away.
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href="/shop?filter=cloths" className="btn btn-lime">Shop the cloths</Link>
            <Link
              href="/shop?filter=dusters"
              className="font-semibold text-paper underline decoration-lime-bright decoration-2 underline-offset-[6px] hover:text-lime-bright"
            >
              See the tools
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
