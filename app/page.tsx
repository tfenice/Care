export default function Home() {
  const moods = ["สบายดี", "พอไหว", "เหนื่อย", "สับสน"];

  return (
    <main className="min-h-screen bg-[#F7F2EB] text-[#1E1F1C] flex items-center justify-center px-6">
      <section className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <p className="text-sm tracking-[0.25em] uppercase text-[#8B6F4E]">
            CARE
          </p>

          <h1 className="text-3xl font-semibold leading-snug">
            วันนี้ใจของคุณ
            <br />
            เป็นอย่างไรบ้าง
          </h1>

          <p className="text-[#6D735B] leading-7">
            พื้นที่เล็ก ๆ ที่อยู่ตรงนี้
            เพื่อรับฟังคุณอย่างอ่อนโยน
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {moods.map((mood) => (
            <button
              key={mood}
              className="rounded-2xl border border-[#D8C7AE] bg-white/60 py-4 text-sm shadow-sm hover:bg-white transition"
            >
              {mood}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <button className="w-full rounded-full bg-[#1E1F1C] text-[#F7F2EB] py-4">
            หยิบไพ่ 1 ใบ
          </button>

          <button className="w-full rounded-full border border-[#8B6F4E] py-4 text-[#8B6F4E]">
            พื้นที่พักใจ
          </button>
        </div>
      </section>
    </main>
  );
}