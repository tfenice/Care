import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LandingPage() {
  // AUTH DISABLED: go straight to app
  redirect("/home");

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-6">
      <section className="max-w-md w-full text-center space-y-10">
        <div className="space-y-5">
          <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">
            CARE
          </p>

          <h1 className="text-3xl font-semibold leading-relaxed text-ink">
            วันนี้ใจของคุณ
            <br />
            เป็นอย่างไรบ้าง
          </h1>

          <p className="text-muted leading-8 font-light">
            พื้นที่เล็ก ๆ
            <br />
            ที่อยู่ตรงนี้เพื่อรับฟังคุณ
          </p>
        </div>

        <Link
          href="/login"
          className="block w-full rounded-full bg-ink text-cream py-4 text-center font-light tracking-wide transition-opacity hover:opacity-75"
        >
          เริ่มต้น
        </Link>
      </section>
    </main>
  );
}
