'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'
import { ACHIEVEMENTS } from '@/lib/achievements'

type UserAchievement = {
  id: string
  createdAt: string
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements')
      if (response.ok) {
        const data = await response.json()
        setAchievements(data.achievements)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary to-dark-secondary p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Succès</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-dark-secondary hover:bg-dark-accent rounded-lg border border-accent-tertiary/20 hover:border-accent-tertiary/40 transition-all group"
          >
            <span className="text-accent-tertiary group-hover:scale-105 transition-transform inline-block">
              ← Retour
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(ACHIEVEMENTS).map((achievement) => {
            const userAchievement = achievements.find(a => a.id === achievement.id)
            
            return (
              <div
                key={achievement.id}
                className={`bg-dark-secondary rounded-xl p-6 border ${
                  userAchievement ? 'border-accent-secondary' : 'border-dark-accent'
                } shadow-lg`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold mb-1">{achievement.name}</h3>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                    {userAchievement && (
                      <p className="text-xs text-accent-secondary mt-2">
                        Obtenu le {new Date(userAchievement.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span className="text-2xl">{achievement.icon}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 