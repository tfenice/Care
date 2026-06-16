"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "หน้าหลัก" },
  { href: "/checkin", label: "เช็คอิน" },
  { href: "/cards", label: "การ์ด" },
  { href: "/journal", label: "บันทึก" },
  { href: "/history", label: "ย้อนดู" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 border-t border-sand bg-cream pb-safe">
      <div className="max-w-md mx-auto flex justify-around py-3">
        {NAV_ITEMS.map(({ href, label }) => {
          const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`px-2 py-2 text-xs transition-colors ${
                active ? "text-ink font-semibold" : "text-muted font-light"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
