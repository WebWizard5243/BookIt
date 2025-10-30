'use client'

import { useState } from 'react'
import { DetailImage } from '@/components/DetailImage'
import { DateSelector } from '@/components/DateSelector'
import { TimeSelector } from '@/components/TimeSelector'
import { BookingSummary } from '@/components/BookingSummary'
import { Experience } from '@/lib/db'

interface Slot {
  id: number
  date: string
  time: string
  total_capacity: number
  booked_count: number
}

interface ExperienceDetailsProps {
  experience: Experience
  slots: Slot[]
}

export function ExperienceDetails({ experience, slots }: ExperienceDetailsProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null)

  const handleTimeSelect = (time: string, slotId: number) => {
    setSelectedTime(time)
    setSelectedSlotId(slotId)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Left Side - Image & Info */}
      <div className="lg:col-span-2">
        <DetailImage imageUrl={experience.image_url} name={experience.name} />

        {/* Experience Title & Description */}
        <div className="mt-6 lg:mt-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-3 lg:mb-4">
            {experience.name}
          </h1>
          <p className="text-gray-700 mb-4 lg:mb-6 text-sm sm:text-base">
            {experience.description}
          </p>

          {/* Choose Date */}
          <div className="mb-6 lg:mb-8">
            <h3 className="text-base sm:text-lg font-bold text-black mb-3 lg:mb-4">Choose date</h3>
            <DateSelector 
              slots={slots} 
              onSelectDate={setSelectedDate}
              selectedDate={selectedDate}
            />
          </div>

          {/* Choose Time */}
          <div className="mb-6 lg:mb-8">
            <h3 className="text-base sm:text-lg font-bold text-black mb-3 lg:mb-4">Choose time</h3>
            <TimeSelector 
              slots={slots}
              onSelectTime={handleTimeSelect}
              selectedTime={selectedTime}
              selectedSlotId={selectedSlotId}
              selectedDate={selectedDate}
            />
          </div>

          {/* About */}
          <div className="mb-6 lg:mb-0">
            <h3 className="text-base sm:text-lg font-bold text-black mb-3 lg:mb-4">About</h3>
            <p className="text-gray-600 text-xs sm:text-sm bg-gray-100 p-3 sm:p-4 rounded">
              {experience.description}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Booking Summary */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <BookingSummary 
          experience={experience} 
          slots={slots}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          selectedSlotId={selectedSlotId}
        />
      </div>
    </div>
  )
}