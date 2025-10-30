import { Header } from '@/components/header'
import { BackButton } from '@/components/BackButton'
import { ExperienceDetails } from '@/components/ExperienceDetails'
import pool, { Experience } from '@/lib/db'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ExperienceDetailPage({ params }: PageProps) {
  const { id } = await params

  // Fetch experience
  const experienceResult = await pool.query<Experience>(`
    SELECT * FROM experiences WHERE id = $1
  `, [id])

  if (experienceResult.rows.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header showSearch={false} />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-gray-500 text-lg">Experience not found</p>
        </div>
      </div>
    )
  }

  const experience = experienceResult.rows[0]

  // Fetch slots
  const slotsResult = await pool.query(`
    SELECT 
      id,
      date,
      time,
      total_capacity,
      booked_count,
      experience_id
    FROM slots 
    WHERE experience_id = $1 
    ORDER BY date ASC, time ASC
  `, [id])

  const slots = slotsResult.rows

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch={true} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <BackButton />
        <ExperienceDetails experience={experience} slots={slots} />
      </main>
    </div>
  )
}
