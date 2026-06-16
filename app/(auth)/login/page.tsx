import Link from "next/link";
import { signIn } from "@/lib/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const sent = params.sent === "1";
  const errorMsg = typeof params.error === "string" ? params.error : params.error ? "error" : null;

  if (sent) {
    return <ConfirmationView />;
  }

  return <LoginForm errorMsg={errorMsg} />;
}

function ConfirmationView() {
  return (
    <div className="text-center space-y-10">
      <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">
        CARE
      </p>

      <div className="space-y-5">
        <h1 className="text-2xl font-semibold text-ink leading-relaxed">
          เช็คอีเมล
          <br />
          ของคุณด้วยนะ
        </h1>
        <p className="text-muted leading-8 font-light">
          เราส่งลิงก์ไปแล้ว
          <br />
          กดลิงก์นั้นเพื่อเริ่มใช้งาน
        </p>
        <p className="text-muted text-sm font-light">
          ลิงก์มีอายุ 1 ชั่วโมง · ลองเช็ค spam ด้วยนะ
        </p>
      </div>

      <Link
        href="/"
        className="inline-block text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity"
      >
        กลับไปหน้าหลัก
      </Link>
    </div>
  );
}

function LoginForm({ errorMsg }: { errorMsg: string | null }) {
  return (
    <div className="space-y-10">
      <div className="text-center space-y-4">
        <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">
          CARE
        </p>
        <h1 className="text-2xl font-semibold text-ink leading-relaxed">
          ยินดีต้อนรับ
        </h1>
        <p className="text-muted font-light leading-8">
          ใส่อีเมลของคุณ
          <br />
          แล้วเราจะส่งลิงก์เข้าใช้งานให้เลย
        </p>
      </div>

      <form action={signIn} className="space-y-4">
        <div className="space-y-2">
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="อีเมลของคุณ"
            className="w-full px-4 py-3 rounded-2xl border border-sand bg-white/60 text-ink placeholder:text-muted focus:outline-none focus:border-brown transition-colors"
          />
          {errorMsg && (
            <p className="text-sm text-error pl-1 break-all">
              {errorMsg}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-ink text-cream py-4 font-light tracking-wide transition-opacity hover:opacity-75"
        >
          รับลิงก์เข้าใช้งาน
        </button>
      </form>

      <p className="text-center text-sm text-muted font-light leading-6">
        ไม่ต้องมีรหัสผ่าน
        <span className="mx-2 text-sand">·</span>
        ปลอดภัย
        <span className="mx-2 text-sand">·</span>
        เป็นส่วนตัว
      </p>
    </div>
  );
}
