'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ConfirmationPage({ params }: PageProps) {
  const [id, setId] = useState<string>('')

  useEffect(() => {
    params.then(p => setId(p.id))
  }, [params])

  return (
    <div className="min-h-screen bg-white">
      <Header showSearch={true} />

      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6">
        <div className="text-center max-w-md w-full">
          {/* Static Circle with Animated Checkmark */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center">
              {/* Animated Checkmark */}
              <motion.svg
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="sm:w-[60px] sm:h-[60px]"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <path
                  d="M5 13l4 4L19 7"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2 sm:mb-3">
            Booking Confirmed
          </h1>

          {/* Reference ID */}
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 break-all">
            Ref ID: <span className="font-semibold text-black text-base sm:text-lg">{id}</span>
          </p>

          {/* Back to Home Button */}
          <Link
            href="/"
            className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-[#FFD643] text-black text-sm sm:text-base font-semibold rounded hover:bg-yellow-500 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}