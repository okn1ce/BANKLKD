'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'

type Bet = {
  id: number
  amount: number
  choice: boolean
  createdAt: string
  betEvent: {
    question: string
    result: boolean | null
  }
}

export default function HistoryPage() {
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchBets()
  }, [])

  const fetchBets = async () => {
    try {
      const response = await fetch('/api/bets/history')
      if (response.ok) {
        const data = await response.json()
        setBets(data.bets)
      }
    } catch (error) {
      console.error('Error fetching bets:', error)
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
          <h1 className="text-2xl font-bold">Historique des paris</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-dark-secondary hover:bg-dark-accent rounded-lg border border-accent-tertiary/20 hover:border-accent-tertiary/40 transition-all group"
          >
            <span className="text-accent-tertiary group-hover:scale-105 transition-transform inline-block">
              ← Retour
            </span>
          </button>
        </div>

        {/* Liste des paris */}
        <div className="bg-dark-secondary rounded-xl p-6 border border-dark-accent shadow-lg space-y-4">
          {bets.length === 0 ? (
            <p className="text-gray-400 text-center">Aucun pari pour le moment</p>
          ) : (
            bets.map((bet) => (
              <div
                key={bet.id}
                className="flex items-center justify-between p-4 border border-dark-accent rounded-lg"
              >
                <div className="space-y-2">
                  <h3 className="font-medium">{bet.betEvent.question}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={bet.choice ? 'text-accent-secondary' : 'text-accent-primary'}>
                      {bet.choice ? 'OUI' : 'NON'}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-accent-secondary font-medium">
                      {bet.amount} LKD
                    </span>
                    {bet.betEvent.result !== null && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className={
                          bet.choice === bet.betEvent.result
                            ? 'text-accent-secondary'
                            : 'text-accent-primary'
                        }>
                          {bet.choice === bet.betEvent.result ? 'Gagné' : 'Perdu'}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(bet.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 