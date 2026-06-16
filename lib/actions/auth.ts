"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    redirect("/login?error=1");
  }

  // --- URL DIAGNOSTIC: set errMsg here, skip signInWithOtp ---
  const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim().replace(/\/$/, "");
  const healthUrl = `${rawUrl}/auth/v1/health`;
  let diagHealth = "?";
  try {
    const r = await fetch(healthUrl, {
      headers: { apikey: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim() },
    });
    diagHealth = `${r.status}`;
  } catch (e: unknown) {
    diagHealth = `ERR:${e instanceof Error ? e.message : String(e)}`;
  }
  let errMsg: string | null = `LEN=${rawUrl.length}|END="${rawUrl.slice(-10)}"|HEALTH=${diagHealth}`;
  // --- END DIAGNOSTIC ---

  if (errMsg) {
    redirect(`/login?error=${encodeURIComponent(errMsg)}`);
  }

  redirect("/login?sent=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
