import Reveal from "./Reveal";

const STATS = [
  { big: "$0", small: "on sprays, ever again", note: "Water does the work — the bottle was just theater." },
  { big: "1", small: "cloth vs. rolls of paper towels", note: "One cloth outlasts a pantry full of paper." },
  { big: "100s", small: "of washes per cloth", note: "Washer or dishwasher, back in service the same day." },
];

export default function TheMath() {
  return (
    <section className="bg-forest-deep py-14 text-[#EFEDE2] md:py-20">
      <div className="wrap">
        <Reveal>
          <div className="accent-rule mb-5" />
          <h2 className="max-w-[18ch] text-paper">Less stuff. Less money. Nothing sprayed in the air.</h2>
          <p className="mt-2 max-w-[52ch] text-[#C9D8BC]">
            The switch pays for itself fast — then keeps paying.
          </p>
        </Reveal>

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal key={s.big} delay={i * 90}>
              <div className="h-full rounded-3xl border border-white/12 bg-white/[0.06] p-6 backdrop-blur-sm">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-[3rem] font-semibold leading-none text-[#F2D63A]">{s.big}</span>
                  <span className="text-[0.98rem] font-semibold text-paper">{s.small}</span>
                </div>
                <p className="mb-0 mt-3 text-[0.95rem] text-[#BFD1B2]">{s.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
