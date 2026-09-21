"use client";

/* Re-mounts on every route change, so each page fades/rises in.
   Purely presentational; respects prefers-reduced-motion via CSS. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
