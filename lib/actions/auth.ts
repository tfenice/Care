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

  let errMsg: string | null = null;
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://care-eight-kappa.vercel.app"}/auth/callback`,
      },
    });
    if (error) errMsg = error.message;
  } catch (e: unknown) {
    errMsg = e instanceof Error ? e.message : "เกิดข้อผิดพลาด";
  }

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
