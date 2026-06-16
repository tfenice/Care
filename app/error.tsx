"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-10">
        <div className="space-y-4">
          <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">CARE</p>
          <h1 className="text-2xl font-semibold text-ink">เกิดข้อผิดพลาด</h1>
          <p className="text-muted font-light leading-8">
            บางอย่างไม่ทำงานตามที่ควรจะเป็น
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="block w-full rounded-full bg-ink text-cream py-4 font-light tracking-wide transition-opacity hover:opacity-75"
          >
            ลองอีกครั้ง
          </button>
          <Link
            href="/home"
            className="block text-sm text-brown underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
