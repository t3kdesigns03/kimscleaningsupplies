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
        src="/images/brand/hero-globe.jpg"
        alt="A glass globe of the Earth resting among green ferns"
        fetchPriority="high"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-[72%_50%]"
      />
      {/* scrims: horizontal for desktop text, vertical lift for phones */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep/95 via-forest-deep/62 to-forest-deep/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep/80 to-forest-deep/20 md:from-forest-deep/15 md:to-transparent" />

      <div className="mx-auto flex min-h-[440px] max-w-site items-center px-4 py-16 sm:px-7 md:min-h-[440px] md:py-14 lg:min-h-[460px]">
        <div className="w-full animate-rise md:max-w-[60%] lg:max-w-[48%]">
          <h1 className="mb-4 text-paper drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
            {/* fixed break: always "Cleans with / just water." at every width */}
            <span className="whitespace-nowrap">Cleans with</span><br /><span className="whitespace-nowrap">just water.</span>
          </h1>
          <p className="mb-8 max-w-[36ch] text-balance text-[1.15rem] font-medium text-paper sm:text-[1.35rem]">
            Wet it. Wring it. Wipe it. Walk away.
          </p>
          <div className="flex flex-wrap items-center gap-3.5">
            <Link href="/shop?filter=cloths" className="btn btn-lime">Shop the cloths</Link>
            <Link href="/shop?filter=dusters" className="btn border-white/85 bg-transparent text-paper hover:bg-white/10">
              See the tools
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
