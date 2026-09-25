import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_MAX_AGE, adminConfigured, adminToken, passwordMatches } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

/* POST { password } → sets the admin cookie, or 401. */
export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json({ error: "ADMIN_PASSWORD is not set on the server." }, { status: 503 });
  }
  let password: unknown = "";
  try {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) password = (await req.json())?.password;
    else password = (await req.formData()).get("password");
  } catch {
    /* fall through to 401 */
  }
  if (!passwordMatches(password)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_MAX_AGE,
  });
  return res;
}

/* DELETE → sign out. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
