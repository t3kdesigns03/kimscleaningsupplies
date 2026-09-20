import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="py-10">
      <div className="wrap narrow py-5 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/logo-mark.png" alt="" width={96} height={96} className="mx-auto mb-5 h-24 w-24 rounded-2xl object-cover shadow-soft" />
        <h1>That page went missing</h1>
        <p className="mx-auto mb-6 max-w-[44ch] text-muted">
          Wrong link, or something we moved. Everything Kim sells is two taps away.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-primary">Go to the shop</Link>
          <Link href="/" className="btn btn-ghost">Home</Link>
        </div>
        <p className="mt-7 text-[0.92rem] text-muted">
          Still stuck? Email <a href="mailto:streakfreeks@yahoo.com">streakfreeks@yahoo.com</a>.
        </p>
      </div>
    </section>
  );
}
