import Link from "next/link";
import { FlagIcon, LoopIcon, DropIcon } from "./Icons";

/* Full-bleed photographic apex. The glass-globe banner is the background;
   a forest scrim on the left keeps the headline crisp while the globe stays
   visible on the right. One copy block, rendered once, at every size. */
export default function Hero() {
  return (
    <section aria-label="Kim's Cleaning Supplies" className="relative isolate overflow-hidden bg-forest-deep">
      {/* apex image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/brand/hero-banner.jpg"
        alt="A glass globe of the Earth resting among ferns and green moss"
        fetchPriority="high"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-[82%_50%]"
      />
      {/* scrims: horizontal for desktop text, vertical lift for phones */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep/95 via-forest-deep/62 to-forest-deep/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep/75 to-transparent md:from-forest-deep/15" />

      <div className="mx-auto flex min-h-[460px] max-w-site items-center px-4 py-14 sm:px-7 md:min-h-[560px] md:py-0">
        <div className="w-full animate-rise md:max-w-[52%]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#EAD24A] backdrop-blur-sm">
            Eco Easy Microfiber · Made in USA
          </div>
          <h1 className="mb-2 text-paper drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
            Cleans with just water.
          </h1>
          <p className="mb-7 max-w-[26ch] text-[1.2rem] font-semibold text-[#DCE9CF] sm:text-[1.4rem]">
            Wet it. Wring it. Wipe it. Walk away.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop?filter=cloths" className="btn btn-lime">Shop the cloths</Link>
            <Link href="/shop?filter=dusters" className="btn btn-ghost">See the tools</Link>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2 p-0">
            {[
              { Icon: FlagIcon, label: "Made in USA" },
              { Icon: LoopIcon, label: "Washable & reusable" },
              { Icon: DropIcon, label: "No sprays" },
            ].map(({ Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[0.86rem] font-semibold text-paper backdrop-blur-sm"
              >
                <Icon className="h-4 w-4 text-lime-bright" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
