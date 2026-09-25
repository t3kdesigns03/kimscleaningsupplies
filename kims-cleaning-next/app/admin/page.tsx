import { cookies } from "next/headers";
import type { Metadata, Viewport } from "next";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminInbox from "@/components/admin/AdminInbox";
import { ADMIN_COOKIE, adminConfigured, isAdminToken } from "@/lib/server/admin-auth";
import { listOrders, supabaseReady } from "@/lib/server/supabase";
import type { OrderRow } from "@/lib/orders";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Orders",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#153F1A",
};

/* Staff-only order inbox. Not linked from the public nav. */
export default async function AdminPage() {
  const jar = await cookies();
  if (!isAdminToken(jar.get(ADMIN_COOKIE)?.value)) {
    return <AdminLogin configured={adminConfigured()} />;
  }

  let orders: OrderRow[] = [];
  let error = "";
  if (!supabaseReady("service")) {
    error = "SUPABASE_SERVICE_ROLE_KEY is not set on the server.";
  } else {
    try {
      orders = await listOrders();
    } catch (e) {
      console.error(e);
      error = "Could not load orders from Supabase.";
    }
  }
  return <AdminInbox initial={orders} initialError={error} />;
}
