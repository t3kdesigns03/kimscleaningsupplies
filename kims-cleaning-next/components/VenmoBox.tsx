"use client";

import { useMemo, useState } from "react";
import { config } from "@/lib/config";
import { useCart } from "./CartProvider";
import { money, money2 } from "@/lib/format";
import { placeOrder, type PlacedOrder } from "@/lib/place-order";

/** False while venmoHandle is unset — the Venmo box is skipped entirely. */
export const venmoConfigured = Boolean(config.venmoHandle && config.venmoHandle !== "REPLACE_ME");
const configured = venmoConfigured;

export default function VenmoBox({ onPaid, blocked = "" }: { onPaid: (placed: PlacedOrder) => void; blocked?: string }) {
  const { lines, total, recordPending, orderRequest } = useCart();
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const { note, appUrl, webUrl, handle } = useMemo(() => {
    const handle = String(config.venmoHandle).replace(/^@/, "");
    const first = lines[0];
    const extra = lines.length > 1 ? ` +${lines.length - 1} more` : "";
    const note = first ? `Kim's order — ${first.name} x${first.qty}${extra}` : "Kim's order";
    const amount = money2(total);
    const webUrl = `https://venmo.com/u/${encodeURIComponent(handle)}`;
    const appUrl = `venmo://paycharge?txn=pay&recipients=${encodeURIComponent(handle)}&amount=${encodeURIComponent(amount)}&note=${encodeURIComponent(note)}`;
    return { note, appUrl, webUrl, handle };
  }, [lines, total]);

  const isPhone = typeof navigator !== "undefined" && /android|iphone|ipad|ipod/i.test(navigator.userAgent);

  if (!configured) return null;
  if (!lines.length) return null;

  return (
    <div className="rounded-2xl border border-line bg-paper p-[18px] shadow-soft">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-[#008CFF] font-serif text-[20px] font-extrabold text-white">V</span>
        <h3 className="m-0 text-[1.16rem]">Or pay with the Venmo app</h3>
      </div>

      <div className="flex justify-between gap-3 border-b border-dashed border-line py-2.5 text-[0.96rem]">
        <span>Send to</span><b className="font-serif">@{handle}</b>
      </div>
      <div className="flex justify-between gap-3 py-2.5 text-[0.96rem]">
        <span>Amount due</span><b className="font-serif">{money(total)}</b>
      </div>

      <p className="mb-1 mt-3 text-[0.9rem] text-muted">Put this in the note so Kim knows what to pack:</p>
      <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-line bg-cream px-3 py-2.5 font-mono text-[0.9rem]" style={{ wordBreak: "break-word" }}>
        <span>{note}</span>
        <button
          type="button"
          className="btn btn-quiet btn-sm ml-auto flex-none"
          onClick={() => {
            if (navigator.clipboard?.writeText) {
              navigator.clipboard.writeText(note).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              });
            }
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a className="btn btn-primary" href={isPhone ? appUrl : webUrl}>Open Venmo</a>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={busy || Boolean(blocked)}
          onClick={async () => {
            setBusy(true);
            recordPending("venmo", note);
            // Honor system: logged as "Received" until Kim sees it land in Venmo.
            const placed = await placeOrder(orderRequest("venmo"));
            setBusy(false);
            setDone(true);
            onPaid(placed);
          }}
        >
          {busy ? "Saving…" : <>I&rsquo;ve paid with Venmo</>}
        </button>
      </div>

      {blocked && <p className="mb-0 mt-3 text-[0.9rem] text-muted">{blocked}</p>}
      <p className="mt-3.5 text-[0.82rem] text-muted">
        Venmo has no way to tell this website that a payment landed, so this step is on the honor
        system. Kim checks Venmo every evening.
      </p>

      {done && (
        <div className="mt-4 rounded-2xl border border-[#C9DCAE] bg-[#EFF4E7] p-4 text-forest-deep">
          <strong className="mb-1 block">Thank you — we&rsquo;ll watch for it.</strong>
          We&rsquo;ll confirm and ship when the payment lands. Email{" "}
          <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a> if you need a receipt.
        </div>
      )}
    </div>
  );
}
