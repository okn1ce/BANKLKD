'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BetSection from '@/components/BetSection'
import UserInfo from '@/components/UserInfo'
import TransferModal from '@/components/TransferModal'
import HistoryModal from '@/components/HistoryModal'
import { TITLES, ANIMATIONS, TEMPORARY_ITEMS } from '@/lib/shop'
import Stats from '@/components/Stats'
import LoadingSpinner from '@/components/LoadingSpinner'
import CurrentBetStats from '@/components/CurrentBetStats'

// Définition des types
type User = {
  id: number
  username: string
  isAdmin: boolean
  balance: number
  title: string | null
  animation: string | null
  customTitle?: string
}

type LeaderboardUser = {
  id: number
  username: string
  balance: number
  title: string | null
  animation: string | null
  customTitle?: string
}

export default function DashboardPage() {
  const [showTransfer, setShowTransfer] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user')
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Erreur serveur')
      }
      const data = await response.json()
      setUser(data.user)
      setLeaderboard(data.leaderboard)
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [router])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary to-dark-secondary p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-start gap-4 opacity-0 animate-fade-in">
          {user && <UserInfo user={user} />}
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/achievements')}
              className="px-4 py-2 bg-dark-secondary hover:bg-dark-accent rounded-lg border border-accent-tertiary/20 hover:border-accent-tertiary/40 transition-all group"
            >
              <span className="text-accent-tertiary group-hover:scale-105 transition-transform inline-block">
                🏆 Achievements
              </span>
            </button>
            <button
              onClick={() => router.push('/shop')}
              className="px-4 py-2 bg-dark-secondary hover:bg-dark-accent rounded-lg border border-accent-secondary/20 hover:border-accent-secondary/40 transition-all group"
            >
              <span className="text-accent-secondary group-hover:scale-105 transition-transform inline-block">
                Magasin
              </span>
            </button>
            {user?.isAdmin && (
              <button
                onClick={() => router.push('/admin')}
                className="px-4 py-2 bg-dark-secondary hover:bg-dark-accent rounded-lg border border-accent-tertiary/20 hover:border-accent-tertiary/40 transition-all group"
              >
                <span className="text-accent-tertiary group-hover:scale-105 transition-transform inline-block">
                  Admin
                </span>
              </button>
            )}
            <button
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' })
                router.push('/login')
              }}
              className="px-4 py-2 bg-dark-secondary hover:bg-dark-accent rounded-lg border border-accent-primary/20 hover:border-accent-primary/40 transition-all group flex items-center gap-2"
            >
              <span className="text-accent-primary group-hover:scale-105 transition-transform inline-block">
                Déconnexion
              </span>
              <svg 
                className="w-4 h-4 text-accent-primary group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="opacity-0 animate-fade-in delay-100">
          <Stats />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-dark-secondary rounded-xl p-6 border border-dark-accent shadow-lg opacity-0 animate-fade-in delay-200">
              <h2 className="text-xl font-bold mb-4">Classement</h2>
              <div className="space-y-3">
                {leaderboard.map((user, index) => {
                  // Chercher le titre dans les deux listes (permanents et temporaires)
                  const userTitle = [...TITLES, ...TEMPORARY_ITEMS.filter(i => i.type === 'title')]
                    .find(t => t.id === user.title)
                  
                  // Chercher l'animation dans les deux listes
                  const userAnimation = [...ANIMATIONS, ...TEMPORARY_ITEMS.filter(i => i.type === 'animation')]
                    .find(a => a.id === user.animation)

                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-dark-accent/30 border border-dark-accent"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold ${
                          index === 0 ? 'text-yellow-500' :
                          index === 1 ? 'text-gray-400' :
                          index === 2 ? 'text-amber-600' :
                          'text-gray-500'
                        }`}>
                          #{index + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          {userTitle && (
                            <span className={`text-sm text-accent-tertiary ${userTitle.css || ''}`}>
                              {userTitle.name}
                            </span>
                          )}
                          <span className={`font-medium ${userAnimation?.css || ''}`}>
                            {user.username}
                          </span>
                        </div>
                      </div>
                      <span className="text-accent-secondary font-medium">
                        {user.balance} LKD
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="opacity-0 animate-fade-in delay-300">
              <BetSection onBetPlaced={fetchUserData} />
            </div>
          </div>
          
          <div className="space-y-4 opacity-0 animate-fade-in delay-400">
            <button
              onClick={() => setShowHistory(true)}
              className="w-full p-4 bg-dark-secondary hover:bg-dark-accent rounded-xl border border-accent-tertiary/20 hover:border-accent-tertiary/40 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Historique des paris</span>
                <span className="text-accent-tertiary group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </button>

            <button
              onClick={() => setShowTransfer(true)}
              className="w-full p-4 bg-dark-secondary hover:bg-dark-accent rounded-xl border border-accent-secondary/20 hover:border-accent-secondary/40 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Transfert de LKD</span>
                <span className="text-accent-secondary group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </button>
          </div>
        </div>

        {showTransfer && (
          <TransferModal
            onClose={() => setShowTransfer(false)}
            onTransfer={fetchUserData}
          />
        )}
        
        {showHistory && (
          <HistoryModal
            onClose={() => setShowHistory(false)}
          />
        )}
      </div>
    </div>
  )
} 