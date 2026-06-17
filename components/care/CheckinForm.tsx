'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { submitCheckin } from '@/lib/actions/checkin'
import { MOOD_KEYS, type MoodKey } from '@/types/models'
import PrimaryButton from '@/components/ui/PrimaryButton'
import { focusRing } from '@/components/ui/focus'

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()
  return (
    <PrimaryButton
      type="submit"
      disabled={disabled || pending}
    >
      {pending ? 'กำลังบันทึก...' : 'บันทึก'}
    </PrimaryButton>
  )
}

const MOOD_DOT: Record<MoodKey, string> = {
  'สบายดี':  'bg-brown',
  'พอไหว':   'bg-brown/50',
  'เหนื่อย': 'bg-muted/60',
  'สับสน':   'bg-sand border border-sand/80',
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
            className={`w-full py-4 px-5 rounded-2xl text-base font-light transition-all duration-200 border flex items-center gap-3 ${focusRing} ${
              selected === mood
                ? 'bg-ink text-cream border-ink shadow-sm'
                : 'bg-white/50 text-ink border-sand hover:border-brown/60 hover:bg-white/70'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors ${
                selected === mood ? 'bg-cream/80' : MOOD_DOT[mood]
              }`}
            />
            <span className="flex-1 text-center">{mood}</span>
          </button>
        ))}
        <input type="hidden" name="mood_key" value={selected ?? ''} />
      </div>

      <textarea
        name="note"
        rows={4}
        placeholder="มีอะไรอยากเล่าไหม"
        className="w-full px-5 py-4 rounded-2xl border border-sand bg-white/60 text-ink placeholder:text-muted focus:outline-none focus:border-brown transition-colors resize-none leading-8 font-light"
      />

      {hasError && (
        <p className="text-sm text-error text-center">มีบางอย่างผิดพลาด ลองอีกครั้งได้นะ</p>
      )}

      <SubmitButton disabled={!selected} />
    </form>
  )
}
