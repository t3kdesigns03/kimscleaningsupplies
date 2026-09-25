import Link from "next/link";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";
import { testimonials } from "@/lib/testimonials";
import { splitEvents } from "@/lib/events";
import Reveal from "@/components/Reveal";
import TheMath from "@/components/TheMath";
import FairsStrip from "@/components/FairsStrip";

const STEPS = [
  { title: "Wet it", body: "Plain tap water. Cold is fine." },
  { title: "Wring it", body: "Hard. Damp, not dripping." },
  { title: "Wipe it", body: "One pass. No circles. No spray." },
  { title: "Walk away", body: "It dries clear. No buffing." },
];

/* Rhythm below the dark photo hero: white and mint bands alternate, big type,
   lots of air, at most one pill per band. Products sit on mint as objects. */
export default function Home() {
  const cloths = products.filter((p) => p.category === "cloths");
  const tools = products.filter((p) => p.category !== "cloths");
  const { upcoming } = splitEvents();
  const next = (upcoming.length ? upcoming : []).slice(0, 3);

  return (
    <>
      <Hero />

      {/* how it works — mint, straight under the hero; flows into the cloths */}
      <section className="section bg-wash pb-0 md:pb-0">
        <div className="wrap">
          <h2 className="mx-auto max-w-[16ch] text-center">Four steps. No bottle.</h2>
          <p className="lede mx-auto text-center">
            The fiber is split so fine it lifts dirt off the surface and holds it. Water does the
            work — not a spray.
          </p>
          {/* Under 480 the steps stack 1–4, number beside the words, so no step copy
              gets squeezed or clipped. 2×2 from 480, 4-up from md. */}
          <ol className="mt-10 grid list-none grid-cols-1 gap-y-6 p-0 min-[480px]:mt-14 min-[480px]:grid-cols-2 min-[480px]:gap-x-6 min-[480px]:gap-y-10 md:mt-20 md:grid-cols-4 md:gap-8">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                className="grid min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 border-t-2 border-forest-deep/20 pt-4 min-[480px]:block min-[480px]:pt-5"
              >
                <span className="row-span-2 block font-serif text-[clamp(2.6rem,6vw,3.6rem)] font-bold leading-none text-leaf">
                  {i + 1}
                </span>
                <h3 className="mb-1 mt-0.5 text-[1.3rem] font-bold min-[480px]:mt-3">{s.title}</h3>
                <p className="m-0 text-[0.95rem] text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* cloths — same mint field, products as objects */}
      <section className="section bg-wash pt-16 md:pt-24">
        <div className="wrap">
          <Reveal>
            <h2>Start with the cloths</h2>
            <p className="lede">
              One cloth. Just water. The same cloth that cleans a kitchen window cleans a windshield.
            </p>
          </Reveal>
          <div className="product-row mt-12 md:mt-16">
            {cloths.map((p) => (
              <div key={p.slug}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <TheMath />

      {/* tools — mint field */}
      <section className="section bg-wash">
        <div className="wrap">
          <h2 className="max-w-[16ch]">Mops, dusters, and the hair towel</h2>
          <p className="lede">
            Same fiber, different jobs. Use the dusters dry so they hold a charge and pull dust
            instead of pushing it around.
          </p>
          <div className="product-row mt-12 md:mt-16">
            {tools.map((p) => (
              <div key={p.slug}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link href="/shop" className="btn btn-primary">See everything</Link>
          </div>
        </div>
      </section>

      {/* testimonials — white, quiet */}
      <section className="section bg-white">
        <div className="wrap">
          <h2>What customers tell us</h2>
          <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-8">
            {[0, 1, 2].map((i) => {
              const t = testimonials[i];
              return (
                <blockquote key={i} className="m-0 border-t-2 border-leaf pt-6">
                  <p className="mb-4 font-serif text-[1.25rem] leading-snug text-forest-deep">&ldquo;{t.text}&rdquo;</p>
                  <cite className="text-[0.92rem] font-bold not-italic">
                    {t.who}
                    {t.where && <span className="font-normal text-muted"> — {t.where}</span>}
                  </cite>
                </blockquote>
              );
            })}
          </div>
          <div className="mt-12">
            <Link href="/about#testimonials" className="btn-link">Read more of them</Link>
          </div>
        </div>
      </section>

      <FairsStrip />

      {/* events — mint */}
      <section className="section bg-wash">
        <div className="wrap">
          <h2>See us this weekend</h2>
          <p className="lede">
            Kim and Alice are on the road most weekends from August through December. There is always
            a demo table. Bring your worst window.
          </p>
          <ul className="mt-12 grid list-none gap-4 p-0 md:mt-16 md:grid-cols-3">
            {next.map((e, i) => (
              <li key={i} className="rounded-2xl bg-white p-6 shadow-soft">
                <div className="font-serif text-[1.1rem] font-bold text-grass">{e.date}</div>
                <strong className="mt-1 block text-[1.08rem] text-forest-deep">{e.name}</strong>
                <span className="text-[0.93rem] text-muted">
                  {[e.venue, `${e.city}, ${e.state}`].filter(Boolean).join(" · ")}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <Link href="/events" className="btn btn-primary">Full fall schedule</Link>
          </div>
        </div>
      </section>
    </>
  );
}
