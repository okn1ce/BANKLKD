'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'
import UserInfo from '@/components/UserInfo'

type User = {
  id: number
  username: string
  balance: number
  title: string | null
  animation: string | null
}

export default function DashboardPage() {
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
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary to-dark-secondary p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Info utilisateur */}
        <UserInfo user={user} />

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/shop')}
            className="bg-dark-secondary hover:bg-dark-accent p-6 rounded-xl border border-dark-accent transition-colors"
          >
            <h2 className="text-xl font-bold mb-2">Magasin</h2>
            <p className="text-gray-400">Achète des titres et des animations</p>
          </button>

          <button
            onClick={() => router.push('/history')}
            className="bg-dark-secondary hover:bg-dark-accent p-6 rounded-xl border border-dark-accent transition-colors"
          >
            <h2 className="text-xl font-bold mb-2">Historique</h2>
            <p className="text-gray-400">Consulte tes paris passés</p>
          </button>

          <button
            onClick={() => router.push('/transfers')}
            className="bg-dark-secondary hover:bg-dark-accent p-6 rounded-xl border border-dark-accent transition-colors"
          >
            <h2 className="text-xl font-bold mb-2">Transferts</h2>
            <p className="text-gray-400">Envoie et reçois des LKD</p>
          </button>

          <button
            onClick={() => router.push('/achievements')}
            className="bg-dark-secondary hover:bg-dark-accent p-6 rounded-xl border border-dark-accent transition-colors"
          >
            <h2 className="text-xl font-bold mb-2">Succès</h2>
            <p className="text-gray-400">Débloque des succès spéciaux</p>
          </button>
        </div>
      </div>
    </div>
  )
} 