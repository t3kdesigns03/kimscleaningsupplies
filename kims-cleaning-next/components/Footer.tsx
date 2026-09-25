import Link from "next/link";
import { config, pickupAddress } from "@/lib/config";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-2 bg-forest-deep py-9 text-[#DCE4D2]">
      <div className="wrap">
        <div className="grid gap-7 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <div className="mb-3">
              <span className="block font-serif text-[22px] font-bold leading-tight text-paper">
                Kim&rsquo;s Cleaning Products
              </span>
              <span className="text-[11px] uppercase tracking-[0.12em] text-[#AFC4A0]">
                {config.tagline}
              </span>
            </div>
            <p className="max-w-[38ch] text-[0.92rem]">
              Kim Schoch and Alice sell Eco Easy microfiber at fairs and home shows across Iowa and
              Illinois — and here, all year.
            </p>
            <p className="mt-3 text-[0.92rem]">
              <a href={`mailto:${config.contactEmail}`} className="text-[#E4EFD2]">
                {config.contactEmail}
              </a>
              <br />
              {pickupAddress}
            </p>
          </div>

          <div>
            <p className="mb-3 font-serif text-[1.05rem] text-paper">Shop</p>
            <ul className="m-0 list-none p-0 text-[0.95rem]">
              <li className="mb-0.5 md:mb-2"><Link href="/shop?filter=cloths" className="inline-flex min-h-[40px] items-center md:min-h-0 text-[#E4EFD2] no-underline hover:underline">Cleaning cloths</Link></li>
              <li className="mb-0.5 md:mb-2"><Link href="/shop?filter=mops" className="inline-flex min-h-[40px] items-center md:min-h-0 text-[#E4EFD2] no-underline hover:underline">Mops</Link></li>
              <li className="mb-0.5 md:mb-2"><Link href="/shop?filter=dusters" className="inline-flex min-h-[40px] items-center md:min-h-0 text-[#E4EFD2] no-underline hover:underline">Dusters</Link></li>
              <li className="mb-0.5 md:mb-2"><Link href="/shop?filter=scrubbies" className="inline-flex min-h-[40px] items-center md:min-h-0 text-[#E4EFD2] no-underline hover:underline">Scrubbies</Link></li>
              <li className="mb-0.5 md:mb-2"><Link href="/shop?filter=hair" className="inline-flex min-h-[40px] items-center md:min-h-0 text-[#E4EFD2] no-underline hover:underline">Hair towel</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 font-serif text-[1.05rem] text-paper">Kim&rsquo;s</p>
            <ul className="m-0 list-none p-0 text-[0.95rem]">
              <li className="mb-0.5 md:mb-2"><Link href="/about" className="inline-flex min-h-[40px] items-center md:min-h-0 text-[#E4EFD2] no-underline hover:underline">About Kim &amp; Alice</Link></li>
              <li className="mb-0.5 md:mb-2"><Link href="/events" className="inline-flex min-h-[40px] items-center md:min-h-0 text-[#E4EFD2] no-underline hover:underline">Where to find us</Link></li>
              <li className="mb-0.5 md:mb-2"><Link href="/contact" className="inline-flex min-h-[40px] items-center md:min-h-0 text-[#E4EFD2] no-underline hover:underline">Fundraisers</Link></li>
              <li className="mb-0.5 md:mb-2"><Link href="/contact" className="inline-flex min-h-[40px] items-center md:min-h-0 text-[#E4EFD2] no-underline hover:underline">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-x-[18px] gap-y-2 border-t border-white/20 pt-4 text-[0.85rem] text-[#A8BC99]">
          <span>&copy; {year} Kim&rsquo;s Cleaning Products</span>
          <span>{config.town}</span>
          <span>PayPal and Venmo accepted</span>
        </div>
      </div>
    </footer>
  );
}
