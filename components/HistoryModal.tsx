'use client'
import { useState, useEffect } from 'react'

export default function HistoryModal({ onClose }) {
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/bets/history')
      if (response.ok) {
        const data = await response.json()
        setBets(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-dark-secondary rounded-xl p-6 w-full max-w-2xl max-h-[80vh] border border-dark-accent shadow-xl animate-modal">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Historique des paris</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(80vh-8rem)] custom-scrollbar">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-dark-accent rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-dark-accent rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-dark-accent rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-dark-accent rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {bets.map((bet) => (
                <div
                  key={bet.id}
                  className="border border-dark-accent rounded-lg p-4 hover:bg-dark-accent/30 transition-colors"
                >
                  <h3 className="font-bold mb-2">{bet.question}</h3>
                  <div className="flex items-center gap-2 text-sm mb-1">
                    {bet.userBet ? (
                      <>
                        <span className="text-gray-400">Mise:</span>
                        <span className="font-medium">{bet.userBet.amount} LKD</span>
                        <span className="text-gray-500">•</span>
                        <span className={bet.userBet.choice ? 'text-accent-secondary' : 'text-accent-primary'}>
                          {bet.userBet.choice ? 'OUI' : 'NON'}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-400">Vous n'avez pas participé</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{new Date(bet.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className={
                      bet.result ? 'text-accent-secondary' : 'text-accent-primary'
                    }>
                      Résultat : {bet.result ? 'OUI' : 'NON'}
                    </span>
                    {bet.userBet && (
                      <>
                        <span>•</span>
                        <span className={
                          bet.result === bet.userBet.choice
                            ? 'text-accent-secondary'
                            : 'text-accent-primary'
                        }>
                          {bet.result === bet.userBet.choice ? 'Gagné' : 'Perdu'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 