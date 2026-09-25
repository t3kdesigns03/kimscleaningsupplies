import type { ReactNode } from "react";

/* The one banner under the nav, used by /, /shop, /about, /events and /contact.

   Every page shows the same photo the same way: the image is sized to the
   banner's HEIGHT (never cropped to fill), so the whole glass globe always
   fits, and the globe's centre is pinned at 70% across. Inner pages are just
   shorter. hero-globe-wide.jpg is hero-globe.jpg widened (globe at 67% of
   the file); its edges fade into FIELD, the photo's own dark green, so there
   is no seam at any width.

   Phones: type first, then the globe in a strip underneath — it never sits
   behind the words. */

const SRC = "/images/brand/hero-globe-wide.jpg";
const FIELD = "#0b1c0e";
const GLOBE_IN_FILE = "67%"; // globe centre, as a share of the image's own width
const FADE = "linear-gradient(90deg, transparent 0%, #000 20%, #000 82%, transparent 100%)";

function Globe({ at, className = "" }: { at: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SRC}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none absolute top-0 h-full w-auto max-w-none ${className}`}
      style={{
        left: at,
        transform: `translateX(-${GLOBE_IN_FILE})`,
        maskImage: FADE,
        WebkitMaskImage: FADE,
      }}
    />
  );
}

export default function PageHero({
  eyebrow,
  title,
  blurb,
  children,
  variant = "page",
  label,
}: {
  eyebrow?: string;
  title: ReactNode;
  blurb?: ReactNode;
  children?: ReactNode;
  variant?: "home" | "page";
  label?: string;
}) {
  const home = variant === "home";
  return (
    <section
      aria-label={label ?? (typeof title === "string" ? title : undefined)}
      className="relative isolate overflow-hidden"
      style={{ backgroundColor: FIELD }}
    >
      {/* tablet + desktop: globe on the right, same spot on every page */}
      <div className="absolute inset-0 -z-20 hidden md:block">
        <Globe at="70%" />
      </div>
      <div
        className="absolute inset-0 -z-10 hidden md:block"
        style={{ background: `linear-gradient(90deg, ${FIELD}f0 0%, ${FIELD}a6 30%, ${FIELD}00 52%)` }}
      />

      <div
        className={`mx-auto flex max-w-site items-center px-4 sm:px-7 ${
          home
            ? "pt-12 md:min-h-[340px] md:py-10 lg:min-h-[clamp(300px,24vw,440px)] lg:py-6"
            : "pt-9 md:min-h-[210px] md:py-8 lg:min-h-[clamp(210px,17vw,240px)]"
        }`}
      >
        <div className={`w-full animate-rise md:max-w-[54%] ${home ? "lg:max-w-[48%]" : "lg:max-w-[58%]"}`}>
          {eyebrow && (
            <span className="inline-block text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#EAD24A]">
              {eyebrow}
            </span>
          )}
          <h1
            className={`text-paper drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] ${
              home
                ? "mb-3 lg:text-[clamp(3.6rem,5.1vw,4.6rem)]"
                : "mb-1.5 mt-1 text-[clamp(2.1rem,8vw,2.6rem)] md:text-[clamp(2.3rem,4.3vw,3.4rem)]"
            }`}
          >
            {title}
          </h1>
          {blurb && (
            <p
              className={
                home
                  ? "mb-6 max-w-[36ch] text-balance text-[1.15rem] font-medium text-paper sm:text-[1.3rem]"
                  : "mb-0 max-w-[48ch] text-[1rem] font-medium text-[#DCE9CF] sm:text-[1.06rem] lg:max-w-[60ch]"
              }
            >
              {blurb}
            </p>
          )}
          {children}
        </div>
      </div>

      {/* phones: the same globe, under the type */}
      <div className={`relative md:hidden ${home ? "mt-8 h-[170px]" : "mt-4 h-[118px]"}`}>
        <Globe at="70%" />
        <div
          className="absolute inset-x-0 top-0 h-10"
          style={{ background: `linear-gradient(180deg, ${FIELD} 0%, ${FIELD}00 100%)` }}
        />
      </div>
    </section>
  );
}
