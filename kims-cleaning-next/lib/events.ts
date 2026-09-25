/* ------------------------------------------------------------------
   Show schedule. Add a line to update. Past dates grey themselves out
   automatically and the home page always shows the next three.
   ------------------------------------------------------------------ */

export interface KEvent {
  date: string;
  name: string;
  venue: string;
  city: string;
  state: string;
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
}

export const events: KEvent[] = [
  { date: "Aug 1", name: "Cantril Dayz Show", venue: "Dutchmen's Event Center", city: "Cantril", state: "IA", start: "2026-08-01", end: "2026-08-01" },
  { date: "Aug 19–22", name: "Central State Shrine Association", venue: "Fairgrounds", city: "Davenport", state: "IA", start: "2026-08-19", end: "2026-08-22" },
  { date: "Aug 28–29", name: "NSRA Quad Cities Street Rod", venue: "Fairgrounds", city: "Davenport", state: "IA", start: "2026-08-28", end: "2026-08-29" },
  { date: "Sep 3–7", name: "Old Threshers Reunion", venue: "", city: "Mt. Pleasant", state: "IA", start: "2026-09-03", end: "2026-09-07" },
  { date: "Sep 11–13", name: "Arcola Broom Fest", venue: "", city: "Arcola", state: "IL", start: "2026-09-11", end: "2026-09-13" },
  { date: "Sep 18–20", name: "Market in the Villa", venue: "Fairgrounds", city: "Centerville", state: "IA", start: "2026-09-18", end: "2026-09-20" },
  { date: "Sep 26–27", name: "Apple & Pork Fest", venue: "", city: "Clinton", state: "IL", start: "2026-09-26", end: "2026-09-27" },
  { date: "Oct 3–4", name: "Spoon River Drive", venue: "Native Winery", city: "Lewistown", state: "IL", start: "2026-10-03", end: "2026-10-04" },
  { date: "Oct 10–11", name: "Spoon River Drive", venue: "Native Winery", city: "Lewistown", state: "IL", start: "2026-10-10", end: "2026-10-11" },
  { date: "Oct 30–31", name: "Arthur Home Harvest Expo", venue: "", city: "Arthur", state: "IL", start: "2026-10-30", end: "2026-10-31" },
  { date: "Nov 7", name: "Holy Ivy", venue: "Bridge View Center", city: "Ottumwa", state: "IA", start: "2026-11-07", end: "2026-11-07" },
  { date: "Nov 13–15", name: "Christmas Market", venue: "Oakley Center", city: "Quincy", state: "IL", start: "2026-11-13", end: "2026-11-15" },
  { date: "Nov 14", name: "Catfish Bend Casino", venue: "", city: "Burlington", state: "IA", start: "2026-11-14", end: "2026-11-14" },
  { date: "Nov 21–22", name: "QSL", venue: "Oakley Center", city: "Quincy", state: "IL", start: "2026-11-21", end: "2026-11-22" },
  { date: "Nov 22", name: "Holiday Extravaganza", venue: "Fairgrounds", city: "Springfield", state: "IL", start: "2026-11-22", end: "2026-11-22" },
  { date: "Dec 4–5", name: "Christmas Market", venue: "Macoupin Fairgrounds", city: "Carlinville", state: "IL", start: "2026-12-04", end: "2026-12-05" },
];

export function splitEvents(now = new Date()) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const upcoming: KEvent[] = [];
  const past: KEvent[] = [];
  for (const e of events) {
    if (new Date(e.end + "T23:59:59") >= today) upcoming.push(e);
    else past.push(e);
  }
  return { upcoming, past };
}

/** One string per show, used as the checkout choice and stored as orders.event_name,
    e.g. "Apple & Pork Fest — Clinton, IL (Sep 26–27)". */
export function eventLabel(e: Pick<KEvent, "name" | "city" | "state" | "date">): string {
  return `${e.name} — ${e.city}, ${e.state} (${e.date})`;
}
