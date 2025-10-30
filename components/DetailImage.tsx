'use client'

import Image from 'next/image'

interface DetailImageProps {
  imageUrl?: string
  name: string
}

export function DetailImage({ imageUrl, name }: DetailImageProps) {
  return (
    <div className="relative h-80 bg-gray-200 rounded-lg overflow-hidden">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
      )}
    </div>
  )
}
