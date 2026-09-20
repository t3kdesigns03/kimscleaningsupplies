import ContactForm from "@/components/ContactForm";
import Link from "next/link";
import { config } from "@/lib/config";

export const metadata = {
  title: "Contact",
  description:
    "Order questions, event bookings, school and church fundraisers, and home-show parties. Email Kim Schoch in Quincy, IL.",
};

export default function ContactPage() {
  return (
    <section className="py-8">
      <div className="wrap">
        <div className="grid items-start gap-6 md:grid-cols-[1.25fr_1fr]">
          <div>
            <span className="eyebrow">We read everything</span>
            <h1>Get in touch</h1>
            <p className="max-w-[52ch] text-muted">
              Schools, churches, clubs and home-show parties are welcome — fundraisers do well with
              these. Order questions get answered the same week.
            </p>
            <div className="mt-4">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-line bg-paper p-[18px] shadow-soft">
              <h3 className="mt-0">Kim Schoch</h3>
              <div className="flex justify-between gap-3 border-b border-dashed border-line py-2.5 text-[0.96rem]">
                <span>Email</span>
                <b className="font-serif"><a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a></b>
              </div>
              <div className="flex justify-between gap-3 py-2.5 text-[0.96rem]">
                <span>Pickup</span>
                <b className="text-right font-serif">2922 Lincoln Hill SW<br />Quincy, IL</b>
              </div>
              <p className="mt-3.5 mb-0 text-[0.9rem] text-muted">
                Pickup is free — choose it at checkout and Kim will email you to arrange a time.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-paper p-[18px] shadow-soft">
              <h3 className="mt-0">Fundraisers</h3>
              <p className="mb-0 text-[0.95rem]">
                Groups take orders on paper, we fill them in one batch, and the group keeps a cut. It
                works because people come back for more cloths — there is no bottle to run out of, but
                there is always another window.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-paper p-[18px] shadow-soft">
              <h3 className="mt-0">Catch us in person</h3>
              <p className="text-[0.95rem]">Most weekends, August through December, across Iowa and Illinois.</p>
              <Link href="/events" className="btn btn-quiet btn-sm">See the schedule</Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
