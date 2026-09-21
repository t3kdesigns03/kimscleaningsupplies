"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);

  // close the drawer on route change
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
    <header className="sticky top-0 z-[60] border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex min-h-[64px] max-w-site items-center gap-2.5 px-4 py-2 sm:px-7">
        <Link href="/" className="mr-auto flex min-w-0 items-center gap-2.5 text-forest-deep no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/logo-mark.svg" alt="" width={44} height={44} className="h-11 w-11 flex-none" />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="whitespace-nowrap font-serif text-[21px] font-bold tracking-tight">Kim&rsquo;s</span>
            <span className="mt-0.5 whitespace-nowrap text-[10.5px] uppercase tracking-[0.09em] text-muted">
              Cleaning Supplies
            </span>
          </span>
        </Link>

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

        <div className="flex flex-none items-center gap-1.5">
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative inline-flex h-[46px] w-[46px] items-center justify-center rounded-xl text-forest-deep hover:bg-grass/10"
          >
            <CartIcon />
            {ready && count > 0 && (
              <span className="absolute right-1 top-1.5 min-w-[20px] rounded-full bg-forest px-1.5 text-center text-[11.5px] font-bold leading-5 text-lime-bright">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-xl text-forest-deep hover:bg-grass/10 lg:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      <div
        className={`fixed inset-0 z-[70] bg-black/40 transition-opacity lg:hidden ${
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
          className={`absolute right-0 top-0 flex h-full w-[min(82vw,330px)] flex-col overflow-y-auto bg-paper px-4 pb-7 pt-3.5 transition-transform ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-xl text-forest-deep hover:bg-grass/10"
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
