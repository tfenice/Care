'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { submitCheckin } from '@/lib/actions/checkin'
import { MOOD_KEYS, type MoodKey } from '@/types/models'

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="w-full rounded-full bg-ink text-cream py-4 font-light tracking-wide transition-opacity hover:opacity-75 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {pending ? 'กำลังบันทึก...' : 'บันทึก'}
    </button>
  )
}

export default function CheckinForm({ hasError }: { hasError: boolean }) {
  const [selected, setSelected] = useState<MoodKey | null>(null)

  return (
    <form action={submitCheckin} className="space-y-8">
      <div className="space-y-3">
        {MOOD_KEYS.map((mood) => (
          <button
            key={mood}
            type="button"
            onClick={() => setSelected(mood)}
            className={`w-full py-4 rounded-2xl text-base font-light transition-colors border ${
              selected === mood
                ? 'bg-ink text-cream border-ink'
                : 'bg-white/40 text-ink border-sand hover:border-brown'
            }`}
          >
            {mood}
          </button>
        ))}
        <input type="hidden" name="mood_key" value={selected ?? ''} />
      </div>

      <textarea
        name="note"
        rows={3}
        placeholder="มีอะไรอยากเล่าไหม"
        className="w-full px-4 py-3 rounded-2xl border border-sand bg-white/60 text-ink placeholder:text-muted focus:outline-none focus:border-brown transition-colors resize-none"
      />

      {hasError && (
        <p className="text-sm text-error text-center">เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง</p>
      )}

      <SubmitButton disabled={!selected} />
    </form>
  )
}
