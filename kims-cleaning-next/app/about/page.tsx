import Link from "next/link";
import { SURFACES, REMOVES } from "@/lib/products";
import { testimonials } from "@/lib/testimonials";
import { pickupAddress } from "@/lib/config";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "About Kim & Alice",
  description:
    "Kim Schoch and Alice sell Eco Easy microfiber at fairs and home shows across Iowa and Illinois. Pickup in Quincy, IL. Water only, made in USA.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Quincy, Illinois"
        title="Kim and Alice"
        blurb="Eco Easy microfiber, sold face to face at fairs and home shows across Iowa and Illinois."
      />

      <section className="section bg-white">
        <div className="wrap grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-[1.12rem]">
              Kim Schoch and Alice sell Eco Easy microfiber — cloths, mops, dusters, and the hair towel
              — at fairs, home shows, and school fundraisers across Iowa and Illinois. They have been
              doing it long enough that people find the booth on purpose.
            </p>
            <p>
              Everything they sell, they use. The demo is the whole pitch: hand someone a damp cloth,
              point at the worst window in the building, and let them try it.
            </p>
            <p>
              Ordering here ships anywhere. If you are near Quincy, choose pickup at checkout and save
              the shipping — Kim is at <strong>{pickupAddress}</strong>.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link href="/shop" className="btn btn-primary">See what they sell</Link>
              <Link href="/events" className="btn-link">Where they&rsquo;ll be</Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-line shadow-lift">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/brand/pack.jpg" alt="The Kim's Cleaning Cloth package with its green earth label" className="aspect-[5/4] w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="section bg-wash">
        <div className="wrap">
          <h2 className="max-w-[16ch]">What makes the cloth different</h2>
          <div className="panel mt-10 border-0 bg-white p-7 shadow-soft md:p-9">
            <p className="mb-0">
              It is <strong>70% polyester and 30% polyamide</strong>, heat-melded rather than woven
              loose. Dry, it feels almost like paper. Wet, it goes soft and lint-free. The fiber is
              split so fine that it lifts dirt and oil off a surface and holds onto it, instead of
              smearing it around the way a cotton rag does. That is why water is enough, and why fabric
              softener ruins it — softener fills in the split fiber and the cloth stops grabbing.
            </p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              ["Time", "One pass, no spray, no buffing, no second cloth to dry with. The kitchen and the bathroom mirrors stop being a project."],
              ["Money", "No more bottles of blue liquid and no more paper towels. A cloth goes through hundreds of washes before it gives up."],
              ["Energy", "Nothing sprayed into the air you are breathing, and nothing to keep out of reach of kids or dogs."],
            ].map(([h, b]) => (
              <div className="panel border-0 bg-white p-7 shadow-soft" key={h}>
                <h3 className="text-[1.1rem]">{h}</h3>
                <p className="mb-0 text-[0.95rem]">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="wrap grid gap-12 md:grid-cols-2">
          <div>
            <h2>Where it works</h2>
            <ul className="facts [column-gap:28px] sm:columns-2">
              {SURFACES.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
          <div>
            <h2>What comes off</h2>
            <ul className="facts [column-gap:28px] sm:columns-2">
              {REMOVES.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <p className="text-[0.92rem] text-muted">Water only. No sprays.</p>
          </div>
        </div>
      </section>

      <section id="testimonials" className="section scroll-mt-20 bg-wash">
        <div className="wrap">
          <h2>What customers tell us</h2>
          <p className="lede">Collected at booths, mostly on the second visit.</p>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <blockquote key={i} className="m-0 rounded-2xl border-l-[5px] border-l-leaf bg-white p-6 shadow-soft">
                <p className="mb-2 font-serif text-[1.1rem] leading-snug text-forest-deep">&ldquo;{t.text}&rdquo;</p>
                <cite className="text-[0.92rem] font-bold not-italic">
                  {t.who}{t.where && <span className="font-normal text-muted"> — {t.where}</span>}
                </cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
