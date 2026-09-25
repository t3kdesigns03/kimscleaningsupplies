"use client";

import { useState } from "react";

export default function AdminLogin({ configured }: { configured: boolean }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        window.location.reload();
        return;
      }
      setErr(res.status === 401 ? "That password didn’t work." : "Sign-in isn’t set up on the server yet.");
    } catch {
      setErr("No connection. Try again.");
    }
    setBusy(false);
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-wash px-2">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-line bg-paper p-6 shadow-lift">
        <div className="mb-5 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/brand/header-globe.png"
            alt=""
            aria-hidden="true"
            width={52}
            height={52}
            className="h-[52px] w-[52px] flex-none rounded-full object-cover shadow-soft ring-2 ring-forest-deep/20"
          />
          <div className="leading-none">
            <span className="block font-serif text-[14px] font-bold tracking-tight text-forest-deep">Kim&rsquo;s Cleaning Products</span>
            <h1 className="m-0 mt-1 font-serif text-[2rem] font-semibold leading-none text-forest-deep">Orders</h1>
          </div>
        </div>
        <p className="eyebrow m-0 mb-3">Staff only</p>
        {!configured && (
          <p className="mb-4 rounded-xl border border-line bg-cream p-3 text-[0.95rem] text-warn">
            ADMIN_PASSWORD isn&rsquo;t set on the server, so nobody can sign in yet.
          </p>
        )}
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
          />
        </label>
        {err && <p className="mb-3 text-[0.95rem] font-semibold text-warn" role="alert">{err}</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={busy || !pw}>
          {busy ? "Checking…" : "Open orders"}
        </button>
      </form>
    </div>
  );
}
