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

  // Derive origin from the incoming request — no env var required.
  // The browser always sends the `origin` header on form POSTs.
  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/checkin`,
    },
  });

  if (error) {
    redirect("/login?error=1");
  }

  redirect("/login?sent=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
