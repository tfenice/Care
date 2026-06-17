'use client'

import { useFormStatus } from 'react-dom'
import PrimaryButton from '@/components/ui/PrimaryButton'

export default function JournalSubmitButton() {
  const { pending } = useFormStatus()
  return (
    <PrimaryButton
      type="submit"
      disabled={pending}
    >
      {pending ? 'กำลังบันทึก...' : 'บันทึก'}
    </PrimaryButton>
  )
}
