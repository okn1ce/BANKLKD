'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ACHIEVEMENTS } from '@/lib/achievements'
import LoadingSpinner from '@/components/LoadingSpinner'
import {
  PlayIcon,
  FireIcon,
  BoltIcon,
  SparklesIcon,
  BanknotesIcon,
  FaceSmileIcon,
  ShoppingCartIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
  HomeIcon,
  TrophyIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

// Map des icônes
const ICONS = {
  PlayIcon,
  FireIcon,
  BoltIcon,
  SparklesIcon,
  BanknotesIcon,
  FaceSmileIcon,
  ShoppingCartIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
  HomeIcon,
  TrophyIcon,
  ArrowTrendingDownIcon
}

export default function AchievementsPage() {
  const [userAchievements, setUserAchievements] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/achievements')
      .then(res => res.json())
      .then(data => {
        setUserAchievements(data.achievements)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error:', error)
        setLoading(false)
      })
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary to-dark-secondary p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center opacity-0 animate-fade-in">
          <h1 className="text-2xl font-bold">Achievements</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-dark-secondary hover:bg-dark-accent rounded-lg border border-accent-secondary/20 hover:border-accent-secondary/40 transition-all"
          >
            Retour au dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-0 animate-fade-in delay-100">
          {Object.values(ACHIEVEMENTS).map((achievement) => {
            const isUnlocked = userAchievements.includes(achievement.id)
            const Icon = ICONS[achievement.icon as keyof typeof ICONS]
            
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border ${
                  isUnlocked 
                    ? 'bg-dark-secondary border-accent-secondary/20' 
                    : 'bg-dark-secondary/50 border-dark-accent filter grayscale'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${
                    isUnlocked ? 'bg-accent-secondary/20' : 'bg-dark-accent'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{achievement.name}</h3>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 