'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

type RewardProps = {
  type: 'achievement' | 'bet' | 'record'
  title: string
  description?: string
  amount?: number
}

export default function RewardAnimation({ type, title, description, amount }: RewardProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Lancer le confetti
    if (show) {
      confetti({
        particleCount: type === 'achievement' ? 100 : 50,
        spread: 70,
        origin: { y: 0.6 }
      })
    }

    // Cacher après 3 secondes
    const timer = setTimeout(() => setShow(false), 3000)
    return () => clearTimeout(timer)
  }, [type])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className={`p-4 rounded-lg shadow-lg border ${
            type === 'achievement' 
              ? 'bg-accent-tertiary/10 border-accent-tertiary' 
              : type === 'bet'
              ? 'bg-accent-secondary/10 border-accent-secondary'
              : 'bg-accent-primary/10 border-accent-primary'
          }`}>
            <div className="flex items-start gap-3">
              {/* Icône */}
              <div className={`p-2 rounded-lg ${
                type === 'achievement'
                  ? 'bg-accent-tertiary/20'
                  : type === 'bet'
                  ? 'bg-accent-secondary/20'
                  : 'bg-accent-primary/20'
              }`}>
                {type === 'achievement' ? '🏆' : type === 'bet' ? '💰' : '📈'}
              </div>

              {/* Contenu */}
              <div className="space-y-1">
                <h3 className="font-bold">{title}</h3>
                {description && (
                  <p className="text-sm text-gray-300">{description}</p>
                )}
                {amount && (
                  <p className={`text-sm font-medium ${
                    amount > 0 ? 'text-accent-secondary' : 'text-accent-primary'
                  }`}>
                    {amount > 0 ? '+' : ''}{amount} LKD
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 