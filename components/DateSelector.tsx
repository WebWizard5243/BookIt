'use client'

import { useMemo } from 'react'

interface Slot {
  id: number
  date: string
  time: string
  total_capacity: number
  booked_count: number
}

interface DateSelectorProps {
  slots: Slot[]
  onSelectDate: (date: string) => void
  selectedDate: string | null
}

export function DateSelector({ slots, onSelectDate, selectedDate }: DateSelectorProps) {
  // ✅ Extract unique calendar dates (ignoring time part)
  const uniqueDates = useMemo(() => {
    const timestamps = new Set<number>()

    slots.forEach(slot => {
      const d = new Date(slot.date)
      d.setHours(0, 0, 0, 0) // normalize to midnight
      timestamps.add(d.getTime())
    })

    // Sort and convert back to ISO date-only format (YYYY-MM-DD)
    return Array.from(timestamps)
      .sort((a, b) => a - b)
      .map(ts => new Date(ts).toISOString().split('T')[0])
  }, [slots])

  return (
    <div className="flex gap-3 flex-wrap">
      {uniqueDates.map((date) => {
        const dateObj = new Date(date)
        const day = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        const isSelected = selectedDate === date

        return (
          <button
            key={date}
            onClick={() => onSelectDate(date)}
            className={`px-4 py-2 rounded font-semibold transition-colors ${
              isSelected
                ? 'bg-yellow-400 text-black'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            style={isSelected ? { backgroundColor: '#FFD643' } : {}}
          >
            {day}
          </button>
        )
      })}
    </div>
  )
}
