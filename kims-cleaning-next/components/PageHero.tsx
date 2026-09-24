/* Short eco band under the sticky header for the inner pages, so /shop,
   /about, /events and /contact carry the same photographed globe as the
   homepage hero instead of a blank cream gradient.

   It reuses the homepage hero image (hero-banner.jpg): the globe sits on
   the right, a forest wash on the left keeps white type crisp. This is a
   band, not the hero — no CTAs, no proof chips (see Hero.tsx for those). */
export default function PageHero({
  eyebrow,
  title,
  blurb,
}: {
  eyebrow?: string;
  title: string;
  blurb?: string;
}) {
  return (
    <section aria-label={title} className="relative isolate overflow-hidden bg-forest-deep">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/brand/hero-banner.jpg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-[88%_50%]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep/95 via-forest-deep/72 to-forest-deep/25" />
      {/* phones: copy runs full width over the globe, so dim it a little more */}
      <div className="absolute inset-0 -z-10 bg-forest-deep/40 md:hidden" />

      <div className="mx-auto flex min-h-[150px] max-w-site items-center px-4 py-8 sm:px-7 md:min-h-[220px] md:py-0">
        <div className="animate-rise">
          {eyebrow && (
            <span className="inline-block text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#EAD24A]">
              {eyebrow}
            </span>
          )}
          <h1 className="mb-1 mt-1.5 text-paper drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">{title}</h1>
          {blurb && (
            <p className="mb-0 max-w-[56ch] text-[1.02rem] font-medium text-[#DCE9CF] sm:text-[1.08rem]">
              {blurb}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
