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
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "";
  const proto = headerStore.get("x-forwarded-proto") ?? "https";
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (host ? `${proto}://${host}` : "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?sent=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
