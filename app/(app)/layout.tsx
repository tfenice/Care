import BottomNav from "@/components/care/BottomNav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // AUTH DISABLED: skip user check
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <main className="flex-1 pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
