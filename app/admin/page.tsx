'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BalanceManager from '@/components/admin/BalanceManager'
import LoadingSpinner from '@/components/LoadingSpinner'
import DangerZone from '@/components/admin/DangerZone'
import { User, BetEvent } from '@/lib/types'

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [bets, setBets] = useState<BetEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [newQuestion, setNewQuestion] = useState('')
  const router = useRouter()

  useEffect(() => {
    Promise.all([
      fetch('/api/user'),
      fetch('/api/bets/all')
    ])
      .then(([userRes, betsRes]) => Promise.all([userRes.json(), betsRes.json()]))
      .then(([userData, betsData]) => {
        if (!userData.user?.isAdmin) {
          router.push('/')
          return
        }
        setUsers(userData.leaderboard)
        setBets(betsData)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error:', error)
        setLoading(false)
      })
  }, [router])

  // Séparer les paris actifs et terminés
  const activeBets = bets.filter(bet => bet.isActive)
  const completedBets = bets.filter(bet => !bet.isActive && bet.result !== null)

  const createBet = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion) return

    try {
      const response = await fetch('/api/bets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: newQuestion })
      })

      if (response.ok) {
        setNewQuestion('')
        const betsRes = await fetch('/api/bets/all')
        const newBets = await betsRes.json()
        setBets(newBets)
      }
    } catch (error) {
      console.error('Erreur lors de la création du pari')
    }
  }

  const setResult = async (betId: number, result: boolean) => {
    try {
      const response = await fetch('/api/bets/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ betId, result })
      })

      if (response.ok) {
        const betsRes = await fetch('/api/bets/all')
        const newBets = await betsRes.json()
        setBets(newBets)
      }
    } catch (error) {
      console.error('Erreur lors de la définition du résultat')
    }
  }

  const handleReset = async () => {
    try {
      await fetch('/api/admin/reset', { method: 'POST' })
      // Recharger toutes les données
      const [userRes, betsRes] = await Promise.all([
        fetch('/api/user'),
        fetch('/api/bets/all')
      ])
      const [userData, betsData] = await Promise.all([
        userRes.json(),
        betsRes.json()
      ])
      
      setUsers(userData.leaderboard)
      setBets(betsData)
    } catch (error) {
      console.error('Error resetting:', error)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary to-dark-secondary p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* En-tête avec animation */}
        <div className="flex justify-between items-center opacity-0 animate-fade-in">
          <h1 className="text-2xl font-bold">Administration</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-dark-secondary hover:bg-dark-accent rounded-lg border border-accent-secondary/20 hover:border-accent-secondary/40 transition-all"
          >
            Retour au dashboard
          </button>
        </div>

        {/* Gestion des LKD avec délai */}
        <div className="opacity-0 animate-fade-in delay-100">
          <BalanceManager users={users} />
        </div>

        {/* Création de paris avec délai */}
        <div className="bg-dark-secondary rounded-xl p-6 border border-dark-accent shadow-lg opacity-0 animate-fade-in delay-200">
          <h2 className="text-xl font-bold mb-4">Créer un nouveau pari</h2>
          <form onSubmit={createBet} className="space-y-4">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Question du pari"
              className="w-full px-4 py-3 bg-dark-accent border-2 border-transparent rounded-lg focus:border-accent-tertiary transition-colors text-white placeholder-gray-500 outline-none"
            />
            <button
              type="submit"
              className="w-full py-3 bg-accent-tertiary hover:bg-accent-tertiary/90 rounded-lg transition-colors"
            >
              Créer le pari
            </button>
          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Section des paris actifs avec délai */}
          <div className="bg-dark-secondary rounded-xl p-6 border border-dark-accent shadow-lg opacity-0 animate-fade-in delay-300">
            <h2 className="text-xl font-bold mb-4">Paris en cours</h2>
            <div className="space-y-4">
              {activeBets.length > 0 ? (
                activeBets.map((bet) => (
                  <div
                    key={bet.id}
                    className="border border-dark-accent rounded-lg p-4 space-y-3"
                  >
                    <h3 className="font-medium">{bet.question}</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setResult(bet.id, true)}
                        className="flex-1 py-2 bg-accent-secondary/20 hover:bg-accent-secondary/30 rounded-lg text-accent-secondary"
                      >
                        Définir OUI
                      </button>
                      <button
                        onClick={() => setResult(bet.id, false)}
                        className="flex-1 py-2 bg-accent-primary/20 hover:bg-accent-primary/30 rounded-lg text-accent-primary"
                      >
                        Définir NON
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">Aucun pari actif</p>
              )}
            </div>
          </div>

          {/* Section des paris terminés avec délai */}
          <div className="bg-dark-secondary rounded-xl p-6 border border-dark-accent shadow-lg opacity-0 animate-fade-in delay-400">
            <h2 className="text-xl font-bold mb-4">Paris terminés</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
              {completedBets.length > 0 ? (
                completedBets.map((bet) => (
                  <div
                    key={bet.id}
                    className="border border-dark-accent rounded-lg p-4 space-y-2"
                  >
                    <h3 className="font-medium">{bet.question}</h3>
                    <div className={`text-sm ${
                      bet.result ? 'text-accent-secondary' : 'text-accent-primary'
                    }`}>
                      Résultat : {bet.result ? 'OUI' : 'NON'}
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(bet.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">Aucun pari terminé</p>
              )}
            </div>
          </div>
        </div>

        {/* Zone dangereuse en dernier */}
        <DangerZone onReset={handleReset} />
      </div>
    </div>
  )
} 