'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'
import UserTitle from '@/components/UserTitle'

type User = {
  id: number
  username: string
  balance: number
  title: string | null
  animation: string | null
  ownedTitles: string
  ownedAnimations: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/user')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary to-dark-secondary p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Profil</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-dark-secondary hover:bg-dark-accent rounded-lg border border-accent-tertiary/20 hover:border-accent-tertiary/40 transition-all group"
          >
            <span className="text-accent-tertiary group-hover:scale-105 transition-transform inline-block">
              ← Retour
            </span>
          </button>
        </div>

        {/* Informations du profil */}
        <div className="bg-dark-secondary rounded-xl p-6 border border-dark-accent shadow-lg">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold mb-2">Pseudo</h2>
              <div className="flex items-center gap-2">
                <UserTitle title={user.title} customTitle={null} />
                <span className={user.animation || ''}>
                  {user.username}
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">Solde</h2>
              <span className="text-accent-secondary font-medium">
                {user.balance} LKD
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">Titres possédés</h2>
              <div className="flex flex-wrap gap-2">
                {JSON.parse(user.ownedTitles).length === 0 ? (
                  <span className="text-gray-400">Aucun titre</span>
                ) : (
                  JSON.parse(user.ownedTitles).map((titleId: string) => (
                    <UserTitle key={titleId} title={titleId} customTitle={null} />
                  ))
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">Animations possédées</h2>
              <div className="flex flex-wrap gap-2">
                {JSON.parse(user.ownedAnimations).length === 0 ? (
                  <span className="text-gray-400">Aucune animation</span>
                ) : (
                  JSON.parse(user.ownedAnimations).map((animationId: string) => (
                    <span key={animationId} className={animationId}>
                      Exemple
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 