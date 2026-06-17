"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) redirect("/login?error=1");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) redirect("/login?error=missing_site_url");

  const emailRedirectTo = `${siteUrl}/auth/callback?next=/checkin`;

  let errMsg: string | null = null;
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (error) errMsg = `SEND:${error.name}|${(error as any).status}|${error.message}`;
  } catch (e: unknown) {
    errMsg = `SEND_THROW:${e instanceof Error ? `${e.name}:${e.message}` : String(e)}`;
  }

  if (errMsg) redirect(`/login?error=${encodeURIComponent(errMsg)}`);

  redirect("/login?sent=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
