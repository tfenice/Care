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
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      errMsg = `API:${error.status}:${error.name}:${error.message}`;
    }
  } catch (e: unknown) {
    errMsg = e instanceof Error ? `THROW:${e.name}:${e.message}` : `THROW:${String(e)}`;
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
