import { events } from "@/lib/events";

/* Social-proof marquee of the real show circuit. Auto-scrolls (great on
   mobile — no scrollbar to fight), pauses on hover, stops for reduced motion. */

// distinct booths, in schedule order
const seen = new Set<string>();
const FAIRS = events
  .filter((e) => (seen.has(e.name) ? false : (seen.add(e.name), true)))
  .map((e) => ({ name: e.name, place: `${e.city}, ${e.state}` }));

const states = Array.from(new Set(events.map((e) => e.state)));

export default function FairsStrip() {
  const loop = [...FAIRS, ...FAIRS]; // duplicated for a seamless track
  return (
    <section className="border-y border-line bg-forest-deep py-7 text-paper">
      <div className="wrap">
        <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-baseline sm:gap-3">
          <span className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#E9C93E]">
            You&rsquo;ve probably seen the booth
          </span>
          <span className="text-[0.9rem] text-[#C9D8BC]">
            {events.length} shows this season across {states.join(" & ")}
          </span>
        </div>
      </div>

      <div className="no-scrollbar mt-4 overflow-hidden" aria-label="Shows the booth appears at">
        <ul className="marquee m-0 list-none gap-2.5 p-0">
          {loop.map((f, i) => (
            <li
              key={i}
              aria-hidden={i >= FAIRS.length}
              className="flex flex-none items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.07] px-4 py-2"
            >
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-leaf" />
              <span className="text-[0.92rem] font-semibold text-paper">{f.name}</span>
              <span className="text-[0.82rem] text-[#AEC49E]">· {f.place}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
