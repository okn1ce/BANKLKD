'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type Bet = {
  username: string
  title: string | null
  amount: number
  choice: boolean
  createdAt: string
}

type CurrentBetStats = {
  totalBettors: number
  totalAmount: number
  yesAmount: number
  noAmount: number
  yesBettors: number
  noBettors: number
  bets: Bet[]
}

export default function CurrentBetStats() {
  const [stats, setStats] = useState<CurrentBetStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/bets/current/stats')
        const data = await res.json()
        setStats(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching current bet stats:', error)
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!stats) return null

  return (
    <div className="space-y-4">
      {/* Barre de progression avec montant total */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="h-2 bg-dark-accent rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent-secondary"
              initial={{ width: 0 }}
              animate={{
                width: `${stats.totalAmount > 0 
                  ? (stats.yesAmount / stats.totalAmount) * 100 
                  : 0}%`
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <div className="text-sm font-medium">
          {stats.totalAmount.toLocaleString()} LKD
        </div>
      </div>

      {/* Stats OUI/NON */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-sm text-accent-secondary">
          {stats.yesBettors} parieurs • {stats.yesAmount.toLocaleString()} LKD
        </div>
        <div className="text-sm text-accent-primary text-right">
          {stats.noBettors} parieurs • {stats.noAmount.toLocaleString()} LKD
        </div>
      </div>

      {/* Liste des paris */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-400">Derniers paris</div>
        <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-dark-accent scrollbar-track-transparent">
          {stats.bets.map((bet, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <span className={bet.choice ? 'text-accent-secondary' : 'text-accent-primary'}>
                  {bet.choice ? 'OUI' : 'NON'}
                </span>
                <span className="font-medium">{bet.username}</span>
                {bet.title && (
                  <span className="text-xs text-gray-400">{bet.title}</span>
                )}
              </div>
              <span className="font-medium">
                {bet.amount.toLocaleString()} LKD
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 