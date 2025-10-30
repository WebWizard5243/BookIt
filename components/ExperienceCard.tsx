'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Experience } from '@/lib/db'

interface ExperienceCardProps {
  experience: Experience
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const router = useRouter()

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/experiences/${experience.id}`)
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-40 bg-gray-200 flex-shrink-0">
        {experience.image_url ? (
          <Image unoptimized
            src={experience.image_url}
            alt={experience.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
        )}
      </div>

      {/* Content - grows to fill space */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title with Location Badge */}
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-lg font-bold text-black">
            {experience.name}
          </h2>
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded whitespace-nowrap">
            {experience.location}
          </span>
        </div>

        {/* Description - grows to push footer down */}
        <p className="text-gray-700 text-xs mb-4 line-clamp-2 flex-grow">
          {experience.description}
        </p>

        {/* Footer: Price & Button - stays at bottom */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-gray-600">From</span>
            <span className="text-2xl font-bold text-black">
              ₹{experience.price}
            </span>
          </div>
          
          <button
            onClick={handleViewDetails}
            className="bg-yellow-400 hover:bg-yellow-500 hover:scale-105 text-black font-semibold text-sm px-5 py-2 rounded transition-all duration-200 hover:shadow-md"
            style={{ backgroundColor: '#FFD643' }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}