"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { CartIcon, MenuIcon, CloseIcon } from "./Icons";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { count, ready, openDrawer } = useCart();
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);

  // pop the badge whenever the count grows
  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 320);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isCur = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-[60] border-b border-line bg-paper">
      <div className="mx-auto flex min-h-[56px] max-w-site items-center gap-2 px-4 sm:px-7 md:min-h-[64px]">
        {/* hamburger — mobile only, far left */}
        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="flex h-11 w-11 flex-none items-center justify-center rounded-xl text-forest-deep hover:bg-grass/10 lg:hidden"
        >
          <MenuIcon />
        </button>

        {/* logo mark + wordmark — centered on mobile, left on desktop */}
        <Link
          href="/"
          className="flex min-w-0 flex-1 items-center justify-center gap-2 px-1 text-forest-deep no-underline lg:flex-none lg:mr-auto lg:justify-start lg:px-0"
        >
          {/* The mark is a round window onto the homepage hero photo itself —
              same file, so header, inner-page bands and hero always match and
              the browser downloads it once. 80.6% puts the window on the globe
              (hero-banner.jpg is 2530x338; globe centre is x~1935). If that
              image is ever replaced, re-aim this. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/brand/hero-banner.jpg"
            alt=""
            aria-hidden="true"
            width={40}
            height={40}
            decoding="async"
            className="h-9 w-9 flex-none rounded-full object-cover object-[80.6%_50%] shadow-sm ring-1 ring-forest-deep/15 md:h-10 md:w-10"
          />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="block w-full truncate text-center font-serif text-[clamp(12.5px,3.6vw,22px)] font-bold tracking-tight text-forest-deep lg:text-left">
              Kim&rsquo;s Cleaning Products
            </span>
            <span className="mt-1 hidden w-full truncate text-[10px] uppercase tracking-[0.15em] text-leaf lg:block">
              Eco Easy Microfiber
            </span>
          </span>
        </Link>

        {/* nav — desktop only */}
        <nav className="mr-2 hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isCur(n.href) ? "page" : undefined}
              className={`rounded-full px-4 py-2.5 text-base font-semibold no-underline hover:bg-grass/10
                ${isCur(n.href) ? "text-leaf" : "text-forest-deep"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* cart — far right */}
        <button
          type="button"
          onClick={openDrawer}
          aria-label={ready && count > 0 ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
          className="relative flex h-11 w-11 flex-none items-center justify-center rounded-xl text-forest-deep hover:bg-grass/10"
        >
          <CartIcon />
          {ready && count > 0 && (
            <span
              className={`absolute right-1 top-1.5 min-w-[20px] rounded-full bg-forest px-1.5 text-center text-[11.5px] font-bold leading-5 text-lime-bright transition-transform duration-200 ${
                bump ? "scale-125" : "scale-100"
              }`}
            >
              {count}
            </span>
          )}
        </button>
      </div>

      {/* mobile drawer */}
      <div
        className={`fixed inset-0 z-[70] overflow-hidden bg-black/40 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`absolute left-0 top-0 flex h-full w-[min(82vw,330px)] flex-col overflow-y-auto bg-paper px-4 pb-7 pt-3.5 transition-transform ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-2 flex justify-between">
            <span className="self-center font-serif text-[18px] font-bold text-forest-deep">Menu</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-forest-deep hover:bg-grass/10"
            >
              <CloseIcon />
            </button>
          </div>
          {[{ href: "/", label: "Home" }, ...NAV, { href: "/cart", label: "Cart" }].map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isCur(n.href) ? "page" : undefined}
              className={`block border-b border-line py-3.5 font-serif text-[22px] font-semibold no-underline ${
                isCur(n.href) ? "text-leaf" : "text-forest-deep"
              }`}
            >
              {n.label}
            </Link>
          ))}
          <p className="mt-auto pt-6 text-[0.9rem] text-muted">
            Eco Easy Microfiber · Made in USA
          </p>
        </div>
      </div>
    </header>
  );
}
