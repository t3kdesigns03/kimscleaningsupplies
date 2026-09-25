"use client";

/* ------------------------------------------------------------------
   The store header, reused on /admin and the staff login:
   dark-green promo bar + cream nav row with the globe mark, the
   "Kim's Cleaning Products" wordmark and the ECO EASY MICROFIBER line.
   Only the right side differs: Home · Refresh · Print list · Sign out
   (login: Home only). Classes mirror components/Header.tsx — keep them
   in step if the store header changes.
   ------------------------------------------------------------------ */

import Link from "next/link";
import PromoBar from "@/components/PromoBar";

const NAV_LINK =
  "inline-flex min-h-[44px] items-center rounded-full px-2.5 text-[15px] font-medium text-forest-deep no-underline hover:bg-grass/10 sm:px-3 lg:px-4 lg:text-[17px]";

export default function AdminHeader({
  mode,
  loading = false,
  onRefresh,
  onPrint,
  onSignOut,
}: {
  mode: "login" | "inbox";
  loading?: boolean;
  onRefresh?: () => void;
  onPrint?: () => void;
  onSignOut?: () => void;
}) {
  return (
    <>
      <PromoBar />
      <header className="sticky top-0 z-[60] border-b border-line bg-paper">
        <div className="mx-auto flex min-h-[56px] max-w-site items-center gap-1 px-2 sm:gap-2 sm:px-7 md:min-h-[64px] lg:min-h-[96px]">
          {/* globe mark + wordmark — same as the store, left-aligned */}
          <Link
            href="/"
            className="mr-auto flex min-w-0 items-center gap-2 text-forest-deep no-underline lg:gap-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/header-globe.png"
              alt=""
              aria-hidden="true"
              width={40}
              height={40}
              decoding="async"
              className="h-9 w-9 flex-none rounded-full object-cover shadow-soft ring-2 ring-forest-deep/20 md:h-10 md:w-10 lg:h-[68px] lg:w-[68px]"
            />
            <span className="flex min-w-0 flex-col leading-none">
              <span className="block w-full truncate font-serif text-[clamp(12.5px,3.6vw,22px)] font-bold tracking-tight text-forest-deep lg:text-[32px] lg:font-semibold lg:tracking-[-0.015em]">
                Kim&rsquo;s Cleaning Products
              </span>
              <span className="mt-1.5 hidden w-full truncate text-[12.5px] font-semibold uppercase tracking-[0.3em] text-forest-deep lg:block">
                Eco Easy Microfiber
              </span>
            </span>
          </Link>

          {/* right side */}
          <nav className="flex flex-none items-center gap-0.5 lg:gap-1" aria-label="Staff">
            <Link href="/" className={NAV_LINK}>Home</Link>
            {mode === "inbox" && (
              <>
                <button type="button" onClick={onRefresh} className={`${NAV_LINK} hidden md:inline-flex`}>
                  {loading ? "Loading…" : "Refresh"}
                </button>
                <button type="button" onClick={onPrint} className="btn btn-lime btn-sm ml-1 hidden md:inline-flex">
                  Print list
                </button>
                <button type="button" onClick={onSignOut} className={NAV_LINK}>
                  Sign out
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
