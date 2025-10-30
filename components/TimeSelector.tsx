'use client'

import { useMemo } from 'react'

interface Slot {
  id: number
  date: string
  time: string
  total_capacity: number
  booked_count: number
}

interface TimeSelectorProps {
  slots: Slot[]
  onSelectTime: (time: string, slotId: number) => void
  selectedTime: string | null
  selectedSlotId?: number | null
  selectedDate?: string | null
}

function formatTime(time: string): string {
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

export function TimeSelector({
  slots,
  onSelectTime,
  selectedTime,
  selectedSlotId,
  selectedDate,
}: TimeSelectorProps) {
  const slotsForDate = useMemo(() => {
    if (!selectedDate) return []

    return slots
      .filter(slot => {
        const slotDateOnly = new Date(slot.date).toISOString().split('T')[0]
        return slotDateOnly === selectedDate
      })
      .map(slot => ({
        time: slot.time,
        slotId: slot.id,
        available: slot.total_capacity - slot.booked_count,
        isFull: slot.total_capacity - slot.booked_count === 0,
      }))
      .sort((a, b) => a.time.localeCompare(b.time))
  }, [slots, selectedDate])

  return (
    <div className="space-y-3">
      <div className="flex gap-3 flex-wrap">
        {slotsForDate.length > 0 ? (
          slotsForDate.map(({ time, slotId, available, isFull }) => {
            const isSelected = selectedSlotId === slotId
            const formattedTime = formatTime(time)

            return (
              <button
                key={slotId}
                onClick={() => !isFull && onSelectTime(time, slotId)}
                disabled={isFull}
                className={`px-4 py-3 rounded font-semibold transition-colors flex items-center justify-center gap-2 min-w-fit ${
                  isFull
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                    : isSelected
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                style={!isFull && isSelected ? { backgroundColor: '#FFD643' } : {}}
              >
                {/* Time */}
                <span className="text-sm">{formattedTime}</span>

                {/* Show only when ≤ 5 left */}
                {!isFull && available <= 5 && (
                  <span className="text-xs font-semibold text-red-600">
                    {available} left
                  </span>
                )}

                {/* Sold Out label */}
                {isFull && (
                  <span className="text-xs font-semibold text-red-600">
                    Sold Out
                  </span>
                )}
              </button>
            )
          })
        ) : (
          <p className="text-sm text-gray-500">No slots available for this date.</p>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        All times are in IST (GMT +5:30)
      </p>
    </div>
  )
}
