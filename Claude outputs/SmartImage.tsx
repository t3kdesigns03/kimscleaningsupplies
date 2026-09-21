"use client";

/* An <img> that walks a list of candidate sources and keeps the first
   that actually loads. Means a product photo you have not added yet
   never leaves a broken thumbnail — it just falls back to the SVG. */

import { useState } from "react";

export default function SmartImage({
  sources,
  alt,
  className,
}: {
  sources: string[];
  alt: string;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const [hidden, setHidden] = useState(false);
  const src = sources[i];

  if (hidden || !src) {
    return <div className={className} aria-hidden="true" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => {
        if (i + 1 < sources.length) setI(i + 1);
        else setHidden(true);
      }}
    />
  );
}
