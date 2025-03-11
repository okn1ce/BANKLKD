'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CurrentBetStats from './CurrentBetStats'
import { BigBetAnimation, WinAnimation, LossAnimation, triggerWinConfetti } from './Animations'

export default function BetSection({ onBetPlaced }) {
  const [currentBet, setCurrentBet] = useState(null)
  const [betAmount, setBetAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [choice, setChoice] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [showBigBetAnimation, setShowBigBetAnimation] = useState(false)
  const [showWinAnimation, setShowWinAnimation] = useState(false)
  const [showLossAnimation, setShowLossAnimation] = useState(false)
  const [animationAmount, setAnimationAmount] = useState(0)

  useEffect(() => {
    fetchCurrentBet()
  }, [])

  const fetchCurrentBet = async () => {
    try {
      const response = await fetch('/api/bets/current')
      if (response.ok) {
        const data = await response.json()
        setCurrentBet(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du pari')
    }
  }

  const placeBet = async (choice: boolean) => {
    if (!betAmount || loading) return
    
    const amount = parseInt(betAmount)
    
    setLoading(true)
    try {
      const response = await fetch('/api/bets/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          betEventId: currentBet.id,
          amount,
          choice
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setBetAmount('')
        onBetPlaced()
        
        // Animation uniquement pour les gros paris
        if (amount >= 1000) {
          setAnimationAmount(amount)
          setShowBigBetAnimation(true)
          setTimeout(() => {
            setShowBigBetAnimation(false)
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Erreur lors du placement du pari')
    }
    setLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (choice !== null) {
      placeBet(choice)
    }
  }

  if (!currentBet) return (
    <div className="bg-dark-secondary rounded-xl p-6 border border-dark-accent shadow-lg">
      <div className="text-center py-8">
        <h3 className="text-xl font-medium text-gray-400 mb-2">
          Pas de pari di jour pour le moment
        </h3>
        <p className="text-sm text-gray-500">
          Revenez plus tard pour de nouveaux paris !
        </p>
      </div>
    </div>
  )

  return (
    <div className="relative">
      <div className="bg-dark-secondary rounded-xl p-6 border border-dark-accent">
        <h2 className="text-xl font-bold mb-4">{currentBet?.question || 'Chargement...'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="Montant du pari"
              className="flex-1 bg-dark-primary rounded-lg px-4 py-3 border border-dark-accent focus:border-accent-secondary outline-none transition-colors"
            />
            <span className="bg-dark-primary rounded-lg px-4 py-3 border border-dark-accent text-gray-400">
              LKD
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="submit"
              onClick={() => setChoice(true)}
              disabled={loading || submitting}
              className="py-3 bg-accent-secondary/20 hover:bg-accent-secondary/30 rounded-lg text-accent-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              OUI
            </button>
            <button
              type="submit"
              onClick={() => setChoice(false)}
              disabled={loading || submitting}
              className="py-3 bg-accent-primary/20 hover:bg-accent-primary/30 rounded-lg text-accent-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              NON
            </button>
          </div>

          <div className="border-t border-dark-accent my-6"></div>

          <CurrentBetStats />
        </form>

        {error && (
          <div className="mt-4 text-sm text-accent-primary">
            {error}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showBigBetAnimation && (
          <BigBetAnimation amount={animationAmount} />
        )}
      </AnimatePresence>
    </div>
  )
} 