import Link from "next/link";

/* Homepage apex: a short banner, text left, the whole glass globe on the right.
   hero-globe-wide.jpg is a 2560x600 banner built from hero-globe.jpg with the
   globe at ~67% across and the full sphere inside the frame, so the band can
   be ~300px tall at 1280 without cropping the globe.

   Phones: text first on the dark field, the globe below it — it never sits
   behind the headline. */
const FIELD = "#0b1c0e"; // the photo's own dark foliage, so edges disappear

export default function Hero() {
  return (
    <section
      aria-label="Kim's Cleaning Products"
      className="relative isolate overflow-hidden"
      style={{ backgroundColor: FIELD }}
    >
      {/* tablet + desktop: banner behind the text */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/brand/hero-globe-wide.jpg"
        alt="A glass globe of the Earth resting among green ferns"
        fetchPriority="high"
        className="pointer-events-none absolute inset-0 -z-20 hidden h-full w-full object-cover object-[64%_50%] md:block lg:object-[50%_50%]"
      />
      {/* left scrim for the type; clears well before the globe */}
      <div
        className="absolute inset-0 -z-10 hidden md:block"
        style={{
          background: `linear-gradient(90deg, ${FIELD}e6 0%, ${FIELD}99 30%, ${FIELD}00 55%)`,
        }}
      />

      <div className="mx-auto flex max-w-site items-center px-4 pt-12 sm:px-7 md:min-h-[340px] md:py-10 lg:min-h-[clamp(300px,24vw,440px)] lg:py-6">
        <div className="w-full animate-rise md:max-w-[56%] lg:max-w-[48%]">
          <h1 className="mb-3 text-paper drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] lg:text-[clamp(3.6rem,5.1vw,4.6rem)]">
            {/* fixed break: always "Cleans with / just water." at every width */}
            <span className="whitespace-nowrap">Cleans with</span><br /><span className="whitespace-nowrap">just water.</span>
          </h1>
          <p className="mb-6 max-w-[36ch] text-balance text-[1.15rem] font-medium text-paper sm:text-[1.3rem]">
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

      {/* phones: the globe sits below the buttons, full width */}
      <div className="relative mt-10 h-[230px] md:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/brand/hero-globe-wide.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-[79%_50%]"
        />
        <div
          className="absolute inset-x-0 top-0 h-16"
          style={{ background: `linear-gradient(180deg, ${FIELD} 0%, ${FIELD}00 100%)` }}
        />
      </div>
    </section>
  );
}
