import Link from "next/link";
import PageHero from "./PageHero";

/* Homepage banner: the shared PageHero, taller, with the slogan and buttons. */
export default function Hero() {
  return (
    <PageHero
      variant="home"
      label="Kim's Cleaning Products"
      title={
        <>
          {/* fixed break: always "Cleans with / just water." at every width */}
          <span className="whitespace-nowrap">Cleans with</span><br /><span className="whitespace-nowrap">just water.</span>
        </>
      }
      blurb="Wet it. Wring it. Wipe it. Walk away."
    >
      <div className="flex flex-wrap items-center gap-3.5">
        <Link href="/shop?filter=cloths" className="btn btn-lime">Shop the cloths</Link>
        <Link href="/shop?filter=dusters" className="btn border-white/85 bg-transparent text-paper hover:bg-white/10">
          See the tools
        </Link>
      </div>
    </PageHero>
  );
}
