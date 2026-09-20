"use client";

import { useEffect, useState } from "react";

let emit: ((msg: string) => void) | null = null;

export function toast(msg: string) {
  if (emit) emit(msg);
}

export function Toaster() {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    emit = (m: string) => {
      setMsg(m);
      setShow(true);
    };
    return () => {
      emit = null;
    };
  }, []);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), 2200);
    return () => clearTimeout(t);
  }, [show, msg]);

  return (
    <div
      aria-live="polite"
      className={`fixed left-1/2 bottom-[86px] z-[90] -translate-x-1/2 rounded-full bg-forest-deep px-5 py-3
        text-[15px] font-semibold text-lime-bright shadow-glow transition-opacity duration-200
        max-w-[calc(100vw-32px)] text-center ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {msg}
    </div>
  );
}
