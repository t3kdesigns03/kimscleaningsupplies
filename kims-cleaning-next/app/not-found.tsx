import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="py-10">
      <div className="wrap narrow py-5 text-center">
        <h1>That page went missing</h1>
        <p className="mx-auto mb-6 max-w-[44ch] text-muted">
          Wrong link, or something we moved. Everything Kim sells is two taps away.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
          <Link href="/shop" className="btn btn-primary">Go to the shop</Link>
          <Link href="/" className="btn-link">Home</Link>
        </div>
        <p className="mt-7 text-[0.92rem] text-muted">
          Still stuck? Email <a href="mailto:streakfreeks@yahoo.com">streakfreeks@yahoo.com</a>.
        </p>
      </div>
    </section>
  );
}
