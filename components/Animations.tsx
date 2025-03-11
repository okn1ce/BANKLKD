'use client'
import { motion } from 'framer-motion'

// Composant pour l'animation de gros paris
export function BigBetAnimation({ amount }: { amount: number }) {
  return (
    <motion.div
      initial={{ scale: 1.5, opacity: 0 }}
      animate={{
        scale: [1.5, 1, 1.2, 1],
        opacity: [0, 1, 1, 1]
      }}
      transition={{
        duration: 0.6,
        times: [0, 0.3, 0.5, 0.6],
        ease: "easeOut"
      }}
      className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-50"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-accent-tertiary mb-2"
      >
        ÉNORME MISE
      </motion.div>
      <div className="text-6xl font-bold text-accent-secondary glow-text">
        {amount.toLocaleString()} LKD
      </div>
    </motion.div>
  )
} 