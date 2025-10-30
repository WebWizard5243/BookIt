import { Header } from '@/components/header'
import { CheckoutForm } from '@/components/CheckoutForm'
import { BookingSummary } from '@/components/BookingSummary'
import pool, { Experience } from '@/lib/db'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    date?: string
    time?: string
    quantity?: string
    slotId?: string
    discountAmount?: string
  }>
}

export default async function CheckoutPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { date, time, quantity, slotId, discountAmount } = await searchParams

  // Fetch experience
  const experienceResult = await pool.query<Experience>(`
    SELECT * FROM experiences WHERE id = $1
  `, [parseInt(id)])

  if (experienceResult.rows.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header showSearch={false} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <p className="text-gray-500 text-base sm:text-lg">Experience not found</p>
        </div>
      </div>
    )
  }

  const experience = experienceResult.rows[0]
  const qty = parseInt(quantity || '1')
  const discount = parseInt(discountAmount || '0')
  
  const subtotal = experience.price * qty
  const afterDiscount = subtotal - discount
  const taxes = Math.round(afterDiscount * 0.06)
  const total = afterDiscount + taxes

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Side - Form */}
          <div className="lg:col-span-2">
            <CheckoutForm 
              experienceId={id}
              slotId={slotId || ''}
              date={date}
              time={time}
              quantity={qty}
              subtotal={subtotal}
            />
          </div>

          {/* Right Side - Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <BookingSummary
              experience={experience}
              date={date}
              time={time}
              quantity={qty}
              subtotal={subtotal}
              discountAmount={discount}
              taxes={taxes}
              total={total}
              isCheckoutMode={true}
            />
          </div>
        </div>
      </main>
    </div>
  )
}