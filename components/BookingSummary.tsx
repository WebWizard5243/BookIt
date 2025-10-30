'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Experience } from '@/lib/db'

interface Slot {
  id: number
  date: string
  time: string
  total_capacity: number
  booked_count: number
}

interface BookingSummaryProps {
  experience: Experience
  slots?: Slot[]
  selectedDate?: string | null
  selectedTime?: string | null
  selectedSlotId?: number | null
  date?: string
  time?: string
  quantity?: number
  subtotal?: number
  discountAmount?: number
  taxes?: number
  total?: number
  isCheckoutMode?: boolean
  isSubmitting?: boolean
}

function formatTime(time?: string): string {
  if (!time) return 'N/A'
  try {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  } catch {
    return time
  }
}

function formatDate(date?: string): string {
  if (!date) return 'N/A'
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch {
    return date
  }
}

export function BookingSummary({
  experience,
  slots = [],
  selectedDate = null,
  selectedTime = null,
  selectedSlotId = null,
  date,
  time,
  quantity: propQuantity,
  subtotal: propSubtotal,
  discountAmount: propDiscountAmount = 0,
  taxes: propTaxes,
  total: propTotal,
  isCheckoutMode = false,
  isSubmitting = false
}: BookingSummaryProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [quantity, setQuantity] = useState(propQuantity || 1)
  const [discountAmount, setDiscountAmount] = useState(propDiscountAmount || 0)
  const [total, setTotal] = useState(propTotal)

  // Watch for discount URL changes (checkout mode only)
  useEffect(() => {
    if (isCheckoutMode) {
      const discountFromURL = searchParams.get('discountAmount')
      if (discountFromURL) {
        const discount = parseInt(discountFromURL)
        setDiscountAmount(discount)

        const finalSubtotal = propSubtotal || 0
        const afterDiscount = finalSubtotal - discount
        const taxes = Math.round(afterDiscount * 0.06)
        const finalTotal = afterDiscount + taxes
        setTotal(finalTotal)
      } else {
        setDiscountAmount(0)
        const finalSubtotal = propSubtotal || 0
        const taxes = Math.round(finalSubtotal * 0.06)
        const finalTotal = finalSubtotal + taxes
        setTotal(finalTotal)
      }
    }
  }, [searchParams, isCheckoutMode, propSubtotal])

  const finalSubtotal = propSubtotal !== undefined ? propSubtotal : (experience.price * quantity)
  const finalDiscountAmount = isCheckoutMode ? discountAmount : 0
  const afterDiscount = finalSubtotal - finalDiscountAmount
  const finalTaxes = isCheckoutMode 
    ? Math.round(afterDiscount * 0.06) 
    : (propTaxes !== undefined ? propTaxes : Math.round(finalSubtotal * 0.06))
  const finalTotal = isCheckoutMode ? total : (propTotal !== undefined ? propTotal : (finalSubtotal + finalTaxes))

  const isDisabled = !selectedDate || !selectedTime

  const handleIncrement = () => {
    setQuantity(q => q + 1)
  }

  const handleDecrement = () => {
    setQuantity(q => (q > 1 ? q - 1 : 1))
  }

  const handleConfirm = () => {
    if (isDisabled) return

    const queryParams = new URLSearchParams({
      date: selectedDate || '',
      time: selectedTime || '',
      quantity: quantity.toString(),
      slotId: (selectedSlotId || '').toString()
    })

    console.log('URL params:', queryParams.toString());

    router.push(`/experiences/${experience.id}/checkout?${queryParams.toString()}`)
  }

  return (
    <div className="sticky top-24 bg-[#E9E9E9] rounded-lg shadow-md p-6">
      <div className="space-y-4">
        {isCheckoutMode ? (
          <>
            {/* Checkout Mode - Read Only */}
            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm text-[#656565] mb-1">Experience</p>
              <p className="font-semibold text-black">{experience.name}</p>
            </div>

            <div className="flex justify-between">
              <span className="text-[#656565] text-sm">Date</span>
              <span className="font-semibold text-black">{formatDate(date)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#656565] text-sm">Time</span>
              <span className="font-semibold text-black">{formatTime(time)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#656565] text-sm">Qty</span>
              <span className="font-semibold text-black">{propQuantity}</span>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200">
              <span className="text-[#656565]">Subtotal</span>
              <span className="font-semibold">₹{finalSubtotal}</span>
            </div>

            {/* Show Discount if Applied */}
            {finalDiscountAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-green-600 font-semibold">Discount</span>
                <span className="text-green-600 font-semibold">-₹{finalDiscountAmount}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-[#656565]">Taxes</span>
              <span className="font-semibold">₹{finalTaxes}</span>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200">
              <span className="font-bold text-lg text-black">Total</span>
              <span className="text-2xl font-bold text-black">₹{finalTotal}</span>
            </div>

            {/* CHECKOUT MODE BUTTON - Submits Form */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full py-3 rounded font-semibold text-black mt-6 transition-colors bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: isSubmitting ? '#ccaa00' : '#FFD643' }}
            >
              {isSubmitting ? 'Processing...' : 'Pay and Confirm'}
            </button>
          </>
        ) : (
          <>
            {/* Booking Mode - Interactive */}
            <div className="flex justify-between items-center">
              <span className="text-[#656565]">Starts at</span>
              <span className="text-2xl font-bold text-black">₹{experience.price}</span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-[#656565]">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDecrement}
                  className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#656565]">Subtotal</span>
              <span className="text-gray-900 font-semibold">₹{finalSubtotal}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#656565]">Taxes</span>
              <span className="text-gray-900 font-semibold">₹{finalTaxes}</span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="font-bold text-black text-lg">Total</span>
              <span className="text-2xl font-bold text-black">₹{finalTotal}</span>
            </div>

            {/* BOOKING MODE BUTTON - Navigates to Checkout */}
            <button
              onClick={handleConfirm}
              disabled={isDisabled}
              className={`w-full py-3 rounded font-semibold text-black mt-6 transition-colors ${
                isDisabled
                  ? 'bg-gray-400 text-gray-800 cursor-not-allowed opacity-50'
                  : 'bg-yellow-400 hover:bg-yellow-500'
              }`}
              style={!isDisabled ? { backgroundColor: '#FFD643' } : {}}
            >
              Confirm
            </button>
          </>
        )}
      </div>
    </div>
  )
}
