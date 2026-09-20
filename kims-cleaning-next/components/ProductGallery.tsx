"use client";

import { useEffect, useRef, useState } from "react";
import { LeftIcon, RightIcon } from "./Icons";

/* Resolves which candidate images actually exist, then shows a simple
   swipeable gallery whose dots match the real number of slides. */
export default function ProductGallery({ sources, alt }: { sources: string[]; alt: string }) {
  const [slides, setSlides] = useState<string[]>([sources[0]]);
  const [at, setAt] = useState(0);
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
      img.onload = () => {
        results[idx] = src;
        done();
      };
      img.onerror = () => {
        results[idx] = null;
        done();
      };
      img.src = src;
    });
    return () => {
      live = false;
    };
  }, [sources]);

  const show = (i: number) => setAt(((i % slides.length) + slides.length) % slides.length);
  const many = slides.length > 1;

  return (
    <div
      className="relative"
      onTouchStart={(e) => (x0.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (x0.current === null || !many) return;
        const dx = e.changedTouches[0].clientX - x0.current;
        if (Math.abs(dx) > 45) show(at + (dx < 0 ? 1 : -1));
        x0.current = null;
      }}
    >
      <div className="aspect-square overflow-hidden rounded-2xl border border-line" style={{ background: "linear-gradient(170deg,#FFFFFF,#EDF6DD)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slides[at]} alt={alt} className="h-full w-full object-cover" />
      </div>
      {many && (
        <>
          <button type="button" aria-label="Previous picture" onClick={() => show(at - 1)}
            className="absolute left-2.5 top-1/2 flex h-[46px] w-[46px] -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper/95 text-forest-deep shadow-soft">
            <LeftIcon className="h-[22px] w-[22px]" />
          </button>
          <button type="button" aria-label="Next picture" onClick={() => show(at + 1)}
            className="absolute right-2.5 top-1/2 flex h-[46px] w-[46px] -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper/95 text-forest-deep shadow-soft">
            <RightIcon className="h-[22px] w-[22px]" />
          </button>
          <div className="mt-3 flex justify-center gap-2.5">
            {slides.map((_, i) => (
              <button key={i} type="button" aria-label={`Picture ${i + 1}`} aria-current={i === at}
                onClick={() => show(i)}
                className={`h-2.5 w-2.5 rounded-full ${i === at ? "bg-forest" : "bg-line"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
