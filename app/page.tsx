'use client'

import { Header } from '@/components/header'
import { ExperienceCard } from '@/components/ExperienceCard'
import { useState, useEffect } from 'react'
import { Experience } from '@/lib/db'

export default function HomePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch experiences
    fetch('/api/experiences')
      .then(res => res.json())
      .then(data => {
        setExperiences(data)
        setFilteredExperiences(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching experiences:', error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    // Filter experiences based on search query
    if (searchQuery.trim() === '') {
      setFilteredExperiences(experiences)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = experiences.filter(exp => 
        exp.name.toLowerCase().includes(query) || 
        exp.description.toLowerCase().includes(query)
      )
      setFilteredExperiences(filtered)
    }
  }, [searchQuery, experiences])

  return (
    <div className="min-h-screen bg-white">
      <Header 
        showSearch={true} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-base sm:text-lg">Loading experiences...</p>
          </div>
        ) : filteredExperiences.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-gray-500 text-base sm:text-lg">
              {searchQuery ? 'No experiences found matching your search' : 'No experiences available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredExperiences.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}