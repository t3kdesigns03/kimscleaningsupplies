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
    <div className="flex min-h-[100dvh] items-center justify-center bg-forest-deep px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-paper p-6 shadow-lift">
        <p className="eyebrow m-0">Staff only</p>
        <h1 className="mb-5 mt-1 text-[2rem]">Orders</h1>
        {!configured && (
          <p className="mb-4 rounded-lg bg-cream p-3 text-[0.95rem] text-warn">
            ADMIN_PASSWORD isn’t set on the server, so nobody can sign in yet.
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
