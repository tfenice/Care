"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    redirect("/login?error=1");
  }

  const headerStore = await headers();
  const xFwdHost = headerStore.get("x-forwarded-host") ?? "";
  const hostHeader = headerStore.get("host") ?? "";
  const proto = headerStore.get("x-forwarded-proto") ?? "https";
  const siteUrlEnv = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const supabaseUrlEnv = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").slice(0, 40);
  const origin = siteUrlEnv || (xFwdHost ? `${proto}://${xFwdHost}` : hostHeader ? `${proto}://${hostHeader}` : "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: origin ? `${origin}/auth/callback` : undefined,
    },
  });

  if (error) {
    const debug = `err=${error.message} | origin=${origin || "EMPTY"} | siteUrl=${siteUrlEnv || "NOT_SET"} | xFwdHost=${xFwdHost || "NONE"} | host=${hostHeader || "NONE"} | supaUrl=${supabaseUrlEnv}`;
    redirect(`/login?error=${encodeURIComponent(debug)}`);
  }

  redirect("/login?sent=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
