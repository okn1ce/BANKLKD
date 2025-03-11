'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'

type Transfer = {
  id: number
  amount: number
  fromUser: {
    username: string
  }
  toUser: {
    username: string
  }
  createdAt: string
}

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchTransfers()
  }, [])

  const fetchTransfers = async () => {
    try {
      const response = await fetch('/api/transfers')
      if (response.ok) {
        const data = await response.json()
        setTransfers(data.transfers)
      }
    } catch (error) {
      console.error('Error fetching transfers:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary to-dark-secondary p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Historique des transferts</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-dark-secondary hover:bg-dark-accent rounded-lg border border-accent-tertiary/20 hover:border-accent-tertiary/40 transition-all group"
          >
            <span className="text-accent-tertiary group-hover:scale-105 transition-transform inline-block">
              ← Retour
            </span>
          </button>
        </div>

        {/* Liste des transferts */}
        <div className="bg-dark-secondary rounded-xl p-6 border border-dark-accent shadow-lg space-y-4">
          {transfers.length === 0 ? (
            <p className="text-gray-400 text-center">Aucun transfert pour le moment</p>
          ) : (
            transfers.map((transfer) => (
              <div
                key={transfer.id}
                className="flex items-center justify-between p-4 border border-dark-accent rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{transfer.fromUser.username}</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-medium">{transfer.toUser.username}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(transfer.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span className="font-medium text-accent-secondary">
                  {transfer.amount} LKD
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 