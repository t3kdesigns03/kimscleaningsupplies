"use client";

import { useState } from "react";
import AdminHeader from "./AdminHeader";

export default function AdminLogin({ configured }: { configured: boolean }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pw) {
      setErr("Enter the staff password.");
      return;
    }
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
    <div className="flex min-h-[100dvh] flex-col bg-wash">
      <AdminHeader mode="login" />
      <div className="flex flex-1 items-start justify-center px-2 pb-16 pt-10 md:items-center md:pt-0">
        <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-line bg-paper p-6 shadow-lift">
          <p className="eyebrow m-0">Staff only</p>
          <h1 className="m-0 mb-5 mt-1 font-serif text-[2.2rem] font-semibold leading-none text-forest-deep">Orders</h1>
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
          {/* store lime CTA — stays lime (not greyed) until it's actually working */}
          <button type="submit" className="btn btn-lime btn-block" disabled={busy}>
            {busy ? "Checking…" : "Open orders"}
          </button>
        </form>
      </div>
    </div>
  );
}
