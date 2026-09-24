import Link from "next/link";
import { splitEvents, type KEvent } from "@/lib/events";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Where to find us",
  description:
    "Fall 2026 schedule: fairs, home shows, and festivals across Iowa and Illinois where Kim and Alice have a booth.",
};

function Row({ e, isNext, dim }: { e: KEvent; isNext?: boolean; dim?: boolean }) {
  const where = [e.venue, `${e.city}, ${e.state}`].filter(Boolean).join(" · ");
  return (
    <li className={`flex items-start gap-3.5 rounded-2xl border border-line bg-paper p-4 ${dim ? "opacity-50" : ""}`}>
      <span className="w-[84px] flex-none font-serif text-[1.02rem] font-bold leading-tight text-forest-deep lg:w-24">
        {e.date}
      </span>
      <span className="min-w-0">
        <strong className="block text-[1.06rem]">
          {e.name}
          {isNext && (
            <span className="ml-2 inline-block rounded-full bg-gold px-2 py-0.5 align-[3px] text-[0.7rem] font-extrabold uppercase tracking-[0.06em] text-[#4A3D00]">
              Next up
            </span>
          )}
        </strong>
        <span className="text-[0.93rem] text-muted">{where}</span>
      </span>
    </li>
  );
}

export default function EventsPage() {
  const { upcoming, past } = splitEvents();

  return (
    <>
      <PageHero
        eyebrow="Fall schedule 2026"
        title="Where to find us"
        blurb="Kim and Alice are on the road most weekends from August through early December. There is always a demo table. Bring your worst window — or your phone screen."
      />

      <section className="py-8">
        <div className="wrap">
          {upcoming.length ? (
            <>
              <h2 className="text-[1.5rem]">Still to come</h2>
              <ul className="mt-4 grid list-none gap-3 p-0 lg:grid-cols-2">
                {upcoming.map((e, i) => <Row key={i} e={e} isNext={i === 0} />)}
              </ul>
            </>
          ) : (
            <>
              <h2 className="text-[1.5rem]">The 2026 season has wrapped</h2>
              <ul className="mt-4 list-none p-0">
                <li className="rounded-2xl border border-line bg-paper p-4">
                  <strong className="block">Next year&rsquo;s dates go up in the summer.</strong>
                  <span className="text-muted">Email us and we will tell you when the schedule is set — or order online any time.</span>
                </li>
              </ul>
            </>
          )}

          {past.length > 0 && (
            <>
              <hr className="my-8 border-0 border-t border-line" />
              <h2 className="text-[1.5rem]">Earlier this season</h2>
              <ul className="mt-4 grid list-none gap-3 p-0 lg:grid-cols-2">
                {past.map((e, i) => <Row key={i} e={e} dim />)}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  );
}
