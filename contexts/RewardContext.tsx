'use client'
import { createContext, useContext, useState } from 'react'
import RewardAnimation from '@/components/Rewards'

type Reward = {
  type: 'achievement' | 'bet' | 'record'
  title: string
  description?: string
  amount?: number
}

type RewardContextType = {
  showReward: (reward: Reward) => void
}

const RewardContext = createContext<RewardContextType | null>(null)

export function RewardProvider({ children }: { children: React.ReactNode }) {
  const [rewards, setRewards] = useState<Reward[]>([])

  const showReward = (reward: Reward) => {
    setRewards(prev => [...prev, reward])
    // Retirer la récompense après 3 secondes
    setTimeout(() => {
      setRewards(prev => prev.filter(r => r !== reward))
    }, 3000)
  }

  return (
    <RewardContext.Provider value={{ showReward }}>
      {children}
      {rewards.map((reward, index) => (
        <RewardAnimation key={index} {...reward} />
      ))}
    </RewardContext.Provider>
  )
}

export function useReward() {
  const context = useContext(RewardContext)
  if (!context) {
    throw new Error('useReward must be used within a RewardProvider')
  }
  return context
} 