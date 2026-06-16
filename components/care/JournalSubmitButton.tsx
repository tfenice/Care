'use client'

import { useFormStatus } from 'react-dom'

export default function JournalSubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-ink text-cream py-4 font-light tracking-wide transition-opacity hover:opacity-75 disabled:opacity-40"
    >
      {pending ? 'กำลังบันทึก...' : 'บันทึก'}
    </button>
  )
}
