'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CheckoutFormProps {
  experienceId: string
  slotId: string
  date?: string
  time?: string
  quantity: number
  subtotal: number
  onSubmitting?: (isSubmitting: boolean) => void
}

export function CheckoutForm({
  experienceId,
  slotId,
  date,
  time,
  quantity,
  subtotal,
  onSubmitting
}: CheckoutFormProps) {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return

    setIsApplying(true)
    try {
      console.log('Applying promo - Code:', promoCode, 'Subtotal:', subtotal)
      
      const response = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode.toUpperCase(),
          subtotal: subtotal
        })
      })

      const data = await response.json()
      console.log('API Response:', data)

      if (response.ok && data.discount) {
        console.log('Setting discount amount to:', data.discount)
        setAppliedPromo({ code: promoCode, discount: data.discount })
        
        
        // Update URL with discount AMOUNT
        const url = new URL(window.location.href)
        url.searchParams.set('discountAmount', data.discount.toString())
        console.log('Updated URL:', url.toString())
        window.history.replaceState({}, '', url)
      } else {
        alert(data.message || 'Invalid promo code')
        setPromoCode('')
      }
    } catch (error) {
      console.error('Error applying promo:', error)
      alert('Failed to apply promo code')
    } finally {
      setIsApplying(false)
    }
  }

  const handleRemovePromo = () => {
    console.log('Removing promo')
    setAppliedPromo(null)
    setPromoCode('')
    
    // Remove discount from URL
    const url = new URL(window.location.href)
    url.searchParams.delete('discountAmount')
    console.log('Updated URL after removal:', url.toString())
    window.history.replaceState({}, '', url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName.trim() || !email.trim()) {
      alert('Please fill in all fields')
      return
    }

    if (!agreeTerms) {
      alert('Please agree to terms and conditions')
      return
    }

    setIsSubmitting(true)
    onSubmitting?.(true)

    try {
      console.log('Submitting booking with:', {
        slotId,
        fullName,
        email,
        quantity,
        promoCode: appliedPromo?.code || null
      })

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: parseInt(slotId),
          fullName,
          email,
          quantity,
          promoCode: appliedPromo?.code || null
        })
      })

      const data = await response.json()
      console.log('Booking response:', data)

      if (response.ok && data.success) {
        // Redirect to confirmation with reference ID
        console.log('Booking successful! Reference ID:', data.booking.reference_id)
        router.push(`/confirmation/${data.booking.reference_id}`)
      } else {
        alert(data.error || 'Booking failed')
        setIsSubmitting(false)
        onSubmitting?.(false)
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking')
      setIsSubmitting(false)
      onSubmitting?.(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} id="checkout-form">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => window.history.back()}
        className="mb-6 sm:mb-8 flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
      >
        ← Checkout
      </button>

      {/* Name & Email */}
      <div className="bg-white rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Promo Code */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Promo code
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={appliedPromo !== null || isSubmitting}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              disabled={!promoCode.trim() || isApplying || appliedPromo !== null || isSubmitting}
              className="px-6 py-2 bg-black text-white font-semibold rounded hover:bg-gray-800 disabled:bg-gray-400 transition-colors whitespace-nowrap"
            >
              {isApplying ? 'Applying...' : 'Apply'}
            </button>
          </div>

          {/* Applied Promo Badge */}
          {appliedPromo && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-green-600">
                ✓ {appliedPromo.code} applied (₹{appliedPromo.discount} off)
              </span>
              <button
                type="button"
                onClick={handleRemovePromo}
                disabled={isSubmitting}
                className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="flex items-start gap-3 mb-4 sm:mb-6">
        <input
          type="checkbox"
          id="terms"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          disabled={isSubmitting}
          className="mt-1 w-4 h-4 rounded border-gray-300 cursor-pointer disabled:opacity-50 flex-shrink-0"
        />
        <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
          I agree to the terms and safety policy
        </label>
      </div>
    </form>
  )
}