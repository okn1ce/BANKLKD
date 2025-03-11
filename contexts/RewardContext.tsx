'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

type Reward = {
  title: string
  description: string
  icon?: string
}

type RewardContextType = {
  showReward: (reward: Reward) => void
}

const RewardContext = createContext<RewardContextType | null>(null)

export function RewardProvider({ children }: { children: ReactNode }) {
  const [currentReward, setCurrentReward] = useState<Reward | null>(null)

  const showReward = (reward: Reward) => {
    setCurrentReward(reward)
    setTimeout(() => setCurrentReward(null), 3000)
  }

  return (
    <RewardContext.Provider value={{ showReward }}>
      {children}
      
      {/* Affichage de la récompense */}
      {currentReward && (
        <div className="fixed top-4 right-4 bg-dark-secondary border border-dark-accent rounded-lg p-4 shadow-lg animate-slide-in z-50">
          <div className="flex items-center gap-3">
            {currentReward.icon && (
              <span className="text-2xl">{currentReward.icon}</span>
            )}
            <div>
              <h3 className="font-bold text-accent-secondary">
                {currentReward.title}
              </h3>
              <p className="text-sm text-gray-400">
                {currentReward.description}
              </p>
            </div>
          </div>
        </div>
      )}
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