"use client";

import { useState } from "react";
import { config } from "@/lib/config";

const TOPICS = ["Order question", "Event", "Fundraiser", "Other"];

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k]))
    .join("&");
}

export default function ContactForm() {
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const topic = String(fd.get("topic") || "Other");
    const message = String(fd.get("message") || "").trim();

    const problems: string[] = [];
    if (!name) problems.push("your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problems.push("a working email address");
    if (!message) problems.push("a message");
    if (problems.length) {
      setError("Still needs " + problems.join(", ") + ".");
      return;
    }

    const openMail = () => {
      const body =
        `From: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ""}About: ${topic}\n\n${message}\n`;
      window.location.href =
        `mailto:${config.contactEmail}?subject=${encodeURIComponent(`[${topic}] ${name}`)}&body=${encodeURIComponent(body)}`;
      setSent(true);
    };

    setBusy(true);
    try {
      if (config.formspreeId) {
        await fetch(`https://formspree.io/f/${config.formspreeId}`, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, topic, message }),
        });
        setSent(true);
      } else {
        // Netlify Forms: POST url-encoded with form-name. Detected via the
        // hidden static form in /public/__forms.html at build time.
        const res = await fetch("/__forms.html", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encode({ "form-name": "contact", name, email, phone, topic, message }),
        });
        if (res.ok) setSent(true);
        else openMail();
      }
    } catch {
      openMail();
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div role="status" className="rounded-2xl border border-[#C9DCAE] bg-[#EFF4E7] p-4 text-forest-deep">
        <strong className="mb-1 block">Sent — thank you.</strong>
        Kim reads these herself, so give her a day or two. If nothing happened, write to{" "}
        <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a> directly.
      </div>
    );
  }

  return (
    <form name="contact" onSubmit={onSubmit} noValidate>
      <input type="hidden" name="form-name" value="contact" />
      <label className="field"><span>Your name</span>
        <input type="text" name="name" autoComplete="name" required />
      </label>
      <label className="field"><span>Email</span>
        <input type="email" name="email" autoComplete="email" required />
      </label>
      <label className="field"><span>Phone <span className="text-[0.85rem] text-muted">(optional)</span></span>
        <input type="tel" name="phone" autoComplete="tel" />
      </label>
      <label className="field"><span>What&rsquo;s this about?</span>
        <select name="topic" defaultValue="Order question">
          {TOPICS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>
      <label className="field"><span>Message</span>
        <textarea name="message" required placeholder="Dates, how many people, or which product you're asking about." />
      </label>

      {error && <p role="alert" className="mb-3.5 rounded-2xl border border-[#E4CDAE] bg-[#FBF1E4] p-3 text-warn">{error}</p>}

      <button type="submit" disabled={busy} className="btn btn-primary btn-block">
        {busy ? "Sending…" : "Send"}
      </button>
      <p className="mt-3 text-[0.82rem] text-muted">
        Goes to Kim. If your browser blocks send, it opens your email app with the message ready.
      </p>
    </form>
  );
}
