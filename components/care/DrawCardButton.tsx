'use client'

import { useFormStatus } from 'react-dom'
import PrimaryButton from '@/components/ui/PrimaryButton'

export default function DrawCardButton() {
  const { pending } = useFormStatus()
  return (
    <PrimaryButton
      type="submit"
      disabled={pending}
    >
      {pending ? 'กำลังมา...' : 'เปิดการ์ดวันนี้'}
    </PrimaryButton>
  )
}
