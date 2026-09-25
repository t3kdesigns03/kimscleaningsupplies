/* ------------------------------------------------------------------
   SERVER ONLY. Shared-password gate for /admin.
   The cookie holds an HMAC of a fixed label keyed by ADMIN_PASSWORD, so
   changing the password in Netlify signs everyone out. The password itself
   never goes into a cookie or into client JS.
   ------------------------------------------------------------------ */

import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "kims_admin";
export const ADMIN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days — Kim stays signed in at the booth

function password(): string {
  return process.env.ADMIN_PASSWORD || "";
}

export function adminConfigured(): boolean {
  return password().length > 0;
}

export function adminToken(): string {
  return createHmac("sha256", password()).update("kims-admin-v1").digest("hex");
}

function same(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function passwordMatches(input: unknown): boolean {
  if (!adminConfigured() || typeof input !== "string") return false;
  return same(input, password());
}

export function isAdminToken(value: string | undefined | null): boolean {
  if (!adminConfigured() || !value) return false;
  return same(value, adminToken());
}
