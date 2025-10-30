'use client'

import { useRouter } from 'next/navigation'

export function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="mb-8 flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
    >
      ← Details
    </button>
  )
}
