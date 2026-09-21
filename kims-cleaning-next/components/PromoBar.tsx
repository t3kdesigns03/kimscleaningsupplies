"use client";

/* Thin announcement bar above the header. The events list IS the
   announcement — the next show rotates through with the evergreen lines.
   Fades between messages; pauses when the tab is hidden. */

import { useEffect, useMemo, useState } from "react";
import { splitEvents } from "@/lib/events";

export default function PromoBar() {
  const messages = useMemo(() => {
    const { upcoming } = splitEvents();
    const next = upcoming[0];
    const lines: string[] = [];
    if (next) lines.push(`Next stop: ${next.name} — ${next.city}, ${next.state}`);
    lines.push("Free pickup in Quincy, IL");
    lines.push("Made in USA · cleans with just water");
    lines.push("Catch us at Iowa & Illinois shows all season");
    return lines;
  }, []);

  const [i, setI] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (messages.length <= 1) return;
    const id = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setI((n) => (n + 1) % messages.length);
        setShow(true);
      }, 320);
    }, 4200);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div className="bg-forest-deep text-center text-paper">
      <div className="wrap flex min-h-[34px] items-center justify-center">
        <p
          className={`m-0 px-2 text-[0.82rem] font-semibold tracking-[0.01em] transition-opacity duration-300 ${
            show ? "opacity-100" : "opacity-0"
          }`}
          aria-live="polite"
        >
          <span className="text-lime-bright">{messages[i]}</span>
        </p>
      </div>
    </div>
  );
}
