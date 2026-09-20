import Link from "next/link";
import { FlagIcon, LoopIcon, DropIcon } from "./Icons";

function Copy() {
  return (
    <div className="animate-rise">
      <div className="eyebrow mb-3.5">Eco Easy Microfiber · Made in USA</div>
      <h1 className="mb-1 text-forest-deep text-shadow-soft">
        Cleans with just water.
      </h1>
      <p className="mb-6 max-w-[24ch] text-[1.15rem] font-semibold text-forest-deep/85 sm:text-[1.3rem]">
        Wet it. Wring it. Wipe it. Walk away.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/shop?filter=cloths" className="btn btn-primary">Shop the cloths</Link>
        <Link href="/shop?filter=dusters" className="btn btn-ghost">See the tools</Link>
      </div>
      <ul className="mt-5 flex flex-wrap gap-2 p-0">
        <li className="chip"><FlagIcon /> Made in USA</li>
        <li className="chip"><LoopIcon /> Washable &amp; reusable</li>
        <li className="chip"><DropIcon /> No sprays</li>
      </ul>
    </div>
  );
}

export default function Hero() {
  return (
    <section aria-label="Kim's Cleaning Supplies" className="bg-botanical">
      {/* Mobile: art band on top, copy below */}
      <div className="md:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/brand/hero-earth-full.jpg"
          alt="A blue-marble Earth wrapped in golden metallic leaves and swirling gold light"
          className="h-[248px] w-full object-cover"
          fetchPriority="high"
        />
        <div className="wrap py-8">
          <Copy />
        </div>
      </div>

      {/* Desktop: full-bleed art on the right, copy over the gradient on the left */}
      <div className="relative isolate hidden overflow-hidden md:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/brand/hero-earth-full.jpg"
          alt="A blue-marble Earth wrapped in golden metallic leaves and swirling gold light"
          className="absolute right-0 top-0 -z-10 h-full w-[64%] object-cover object-left"
          fetchPriority="high"
        />
        <div className="wrap flex min-h-[540px] items-center">
          <div className="max-w-[47%]">
            <Copy />
          </div>
        </div>
      </div>
    </section>
  );
}
