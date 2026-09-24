import Reveal from "./Reveal";

const STATS = [
  { big: "$0", small: "on sprays", note: "Nothing to spray, ever again." },
  { big: "1", small: "cloth vs. rolls of paper towels", note: "One cloth outlasts a pantry of paper towels." },
  { big: "Hundreds", small: "of washes per cloth", note: "Washer or dishwasher, back in service the same day." },
];

/* Big green numbers on a white band — no boxes, no dark slab. */
export default function TheMath() {
  return (
    <section className="section bg-white">
      <div className="wrap">
        <Reveal>
          <h2 className="max-w-[18ch]">Less stuff. Less money. Nothing sprayed in the air.</h2>
          <p className="lede">The switch pays for itself fast — then keeps paying.</p>
        </Reveal>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
          {STATS.map((s, i) => (
            <Reveal key={s.big} delay={i * 90}>
              <div className="border-t-2 border-forest-deep/15 pt-6">
                <span className="block font-serif text-[clamp(3rem,5vw,4rem)] font-bold leading-none tracking-[-0.03em] text-forest">
                  {s.big}
                </span>
                <span className="mt-2 block text-[1.02rem] font-semibold text-forest-deep">{s.small}</span>
                <p className="mb-0 mt-2 text-[0.98rem] text-muted">{s.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
