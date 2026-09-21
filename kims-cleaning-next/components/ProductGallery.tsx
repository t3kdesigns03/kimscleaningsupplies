"use client";

import { useEffect, useRef, useState } from "react";
import { LeftIcon, RightIcon, CloseIcon } from "./Icons";

/* Resolves which candidate images actually exist, then shows a swipeable
   gallery on a clean white ground with a thumbnail strip and a tap-to-open
   lightbox. Dots/thumbs match the real number of slides. */
export default function ProductGallery({ sources, alt }: { sources: string[]; alt: string }) {
  const [slides, setSlides] = useState<string[]>([sources[0]]);
  const [at, setAt] = useState(0);
  const [zoom, setZoom] = useState(false);
  const x0 = useRef<number | null>(null);

  useEffect(() => {
    let live = true;
    const results: (string | null)[] = new Array(sources.length).fill(null);
    let left = sources.length;
    if (!left) return;
    sources.forEach((src, idx) => {
      const img = new Image();
      const done = () => {
        if (--left === 0 && live) {
          const found = results.filter(Boolean) as string[];
          setSlides(found.length ? found : [sources[0]]);
          setAt(0);
        }
      };
      img.onload = () => { results[idx] = src; done(); };
      img.onerror = () => { results[idx] = null; done(); };
      img.src = src;
    });
    return () => { live = false; };
  }, [sources]);

  const many = slides.length > 1;
  const show = (i: number) => setAt(((i % slides.length) + slides.length) % slides.length);

  // lightbox: lock scroll + keyboard nav
  useEffect(() => {
    if (!zoom) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      if (many && e.key === "ArrowRight") show(at + 1);
      if (many && e.key === "ArrowLeft") show(at - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [zoom, at, many]); // eslint-disable-line react-hooks/exhaustive-deps

  const swipe = {
    onTouchStart: (e: React.TouchEvent) => (x0.current = e.touches[0].clientX),
    onTouchEnd: (e: React.TouchEvent) => {
      if (x0.current === null || !many) return;
      const dx = e.changedTouches[0].clientX - x0.current;
      if (Math.abs(dx) > 45) show(at + (dx < 0 ? 1 : -1));
      x0.current = null;
    },
  };

  return (
    <div>
      <div className="relative" {...swipe}>
        <button
          type="button"
          onClick={() => setZoom(true)}
          aria-label="Zoom picture"
          className="block aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-white"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slides[at]} alt={alt} className="h-full w-full object-contain p-3" />
        </button>
        {many && (
          <>
            <button type="button" aria-label="Previous picture" onClick={() => show(at - 1)}
              className="absolute left-2.5 top-1/2 flex h-[46px] w-[46px] -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper/95 text-forest-deep shadow-soft hover:bg-paper">
              <LeftIcon className="h-[22px] w-[22px]" />
            </button>
            <button type="button" aria-label="Next picture" onClick={() => show(at + 1)}
              className="absolute right-2.5 top-1/2 flex h-[46px] w-[46px] -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper/95 text-forest-deep shadow-soft hover:bg-paper">
              <RightIcon className="h-[22px] w-[22px]" />
            </button>
          </>
        )}
      </div>

      {/* thumbnails */}
      {many && (
        <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto">
          {slides.map((s, i) => (
            <button
              key={s + i}
              type="button"
              aria-label={`Picture ${i + 1}`}
              aria-current={i === at}
              onClick={() => show(i)}
              className={`h-16 w-16 flex-none overflow-hidden rounded-xl border bg-white transition ${
                i === at ? "border-forest ring-2 ring-forest/30" : "border-line hover:border-grass"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s} alt="" className="h-full w-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}

      {/* lightbox */}
      {zoom && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-forest-deep/92 p-4"
          onClick={() => setZoom(false)}
          {...swipe}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setZoom(false)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-paper hover:bg-white/25"
          >
            <CloseIcon />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slides[at]}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[86vh] max-w-full rounded-xl bg-white object-contain"
          />
          {many && (
            <>
              <button type="button" aria-label="Previous picture"
                onClick={(e) => { e.stopPropagation(); show(at - 1); }}
                className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-paper hover:bg-white/25">
                <LeftIcon />
              </button>
              <button type="button" aria-label="Next picture"
                onClick={(e) => { e.stopPropagation(); show(at + 1); }}
                className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-paper hover:bg-white/25">
                <RightIcon />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-[0.85rem] font-semibold text-paper">
                {at + 1} / {slides.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
