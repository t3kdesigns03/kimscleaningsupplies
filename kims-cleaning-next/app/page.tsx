import Link from "next/link";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";
import { testimonials } from "@/lib/testimonials";
import { splitEvents } from "@/lib/events";
import { DropIcon, WringIcon, WipeIcon, WalkIcon } from "@/components/Icons";

const STEPS = [
  { icon: DropIcon, title: "Wet it", body: "Plain tap water. Cold is fine." },
  { icon: WringIcon, title: "Wring it", body: "Hard. Damp, not dripping." },
  { icon: WipeIcon, title: "Wipe it", body: "One pass. No circles, no spray." },
  { icon: WalkIcon, title: "Walk away", body: "It dries clear on its own. No buffing." },
];

export default function Home() {
  const cloths = products.filter((p) => p.category === "cloths");
  const tools = products.filter((p) => p.category !== "cloths").slice(0, 3);
  const { upcoming } = splitEvents();
  const next = (upcoming.length ? upcoming : []).slice(0, 3);

  return (
    <>
      <Hero />

      {/* how it works */}
      <section className="bg-cream py-11 md:py-16">
        <div className="wrap">
          <h2 className="text-center">Four steps, no bottle</h2>
          <p className="mx-auto mb-7 max-w-[52ch] text-center text-muted">
            The fiber is split so fine it lifts dirt off the surface and holds it. That is the whole
            trick — the spray was never doing the work.
          </p>
          <ol className="grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.title} className="rounded-2xl border border-line bg-paper p-4 text-center">
                <span className="mb-2.5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-forest text-lime-bright">
                  <s.icon className="h-[22px] w-[22px]" />
                </span>
                <h3 className="mb-1 text-[1.12rem]">{s.title}</h3>
                <p className="m-0 text-[0.9rem] text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* cloths */}
      <section className="py-11 md:py-16">
        <div className="wrap">
          <h2>Start with the cloths</h2>
          <p className="max-w-[54ch] text-muted">
            One cloth. Just water. The same trick that works on a kitchen window works on a windshield.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {cloths.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* tools */}
      <section className="bg-cream py-11 md:py-16">
        <div className="wrap">
          <h2>Mops, dusters and the hair towel</h2>
          <p className="max-w-[54ch] text-muted">
            Same fiber, different jobs. The dusters are dry-use only — that is how they hold a charge
            and pull dust off instead of pushing it around.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="mt-6">
            <Link href="/shop" className="btn btn-ghost">See everything</Link>
          </div>
        </div>
      </section>

      {/* testimonials */}
      <section className="py-11 md:py-16">
        <div className="wrap">
          <h2>What people tell us at the booth</h2>
          <div className="mt-5 grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => {
              const t = testimonials[i];
              return (
                <blockquote key={i} className="rounded-2xl border border-l-[5px] border-line border-l-leaf bg-paper p-[18px]">
                  <p className="mb-2 font-serif text-[1.1rem] leading-snug text-forest-deep">&ldquo;{t.text}&rdquo;</p>
                  <cite className="text-[0.92rem] font-bold not-italic">
                    {t.who}
                    {t.where && <span className="font-normal text-muted"> — {t.where}</span>}
                  </cite>
                </blockquote>
              );
            })}
          </div>
          <div className="mt-6">
            <Link href="/about#testimonials" className="btn btn-quiet">Read more of them</Link>
          </div>
        </div>
      </section>

      {/* events */}
      <section className="bg-forest-deep py-11 text-[#EFEDE2] md:py-16">
        <div className="wrap">
          <h2 className="text-paper">Come say hi</h2>
          <p className="max-w-[54ch] text-[#D3E0C6]">
            Kim and Alice are on the road most weekends from August through December. Bring your worst
            window — there is a demo table.
          </p>
          <ul className="mt-5 grid list-none gap-3 p-0 md:grid-cols-3">
            {next.map((e, i) => (
              <li key={i} className="rounded-2xl border border-white/20 bg-white/[0.07] p-4">
                <div className="font-serif text-[1.02rem] font-bold text-[#E9C93E]">{e.date}</div>
                <strong className="mt-1 block text-paper">{e.name}</strong>
                <span className="text-[0.93rem] text-[#BDCFAE]">
                  {[e.venue, `${e.city}, ${e.state}`].filter(Boolean).join(" · ")}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Link href="/events" className="btn btn-quiet">Full fall schedule</Link>
          </div>
        </div>
      </section>

      {/* fundraiser */}
      <section className="bg-cream py-11 md:py-16">
        <div className="wrap narrow text-center">
          <h2>School, church, or a party at your place</h2>
          <p className="text-muted">
            Fundraisers do well with these because people actually use them up and come back. Home-show
            parties work the same way — you host, Kim brings the demo table.
          </p>
          <Link href="/contact" className="btn btn-primary">Get in touch</Link>
        </div>
      </section>
    </>
  );
}
