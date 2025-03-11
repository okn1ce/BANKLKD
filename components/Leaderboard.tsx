'use client'
import { useState, useEffect } from 'react'
import { TITLES, ANIMATIONS } from '@/lib/shop'

// Types
type User = {
  id: number
  username: string
  balance: number
  title: string | null
  animation: string | null
}

type LeaderboardProps = {
  users: User[]
}

// Composant LeaderboardUser
const LeaderboardUser = ({ user, rank }: { user: User, rank: number }) => {
  // Trouver le titre et l'animation de l'utilisateur
  const userTitle = TITLES.find(t => t.id === user.title)
  const userAnimation = ANIMATIONS.find(a => a.id === user.animation)

  // Déterminer la couleur du rang
  const rankColor = 
    rank === 0 ? 'text-yellow-500' :
    rank === 1 ? 'text-gray-400' :
    rank === 2 ? 'text-amber-600' :
    'text-gray-500'

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-dark-accent/30 border border-dark-accent">
      {/* Rang */}
      <div className={`text-lg font-bold ${rankColor}`}>
        #{rank + 1}
      </div>

      {/* Info utilisateur */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {/* Titre */}
          {userTitle && (
            <span className={`text-sm ${
              userTitle.id === 'riche' 
                ? 'bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500 bg-clip-text text-transparent font-bold animate-shine'
                : 'text-accent-tertiary'
            }`}>
              {userTitle.name}
            </span>
          )}

          {/* Pseudo avec animation */}
          <span className={`font-medium ${userAnimation?.css || ''}`}>
            {user.username}
          </span>
        </div>
      </div>

      {/* Solde */}
      <span className="text-accent-secondary font-medium">
        {user.balance} LKD
      </span>
    </div>
  )
}

// Composant principal Leaderboard
export default function Leaderboard({ users }: LeaderboardProps) {
  if (!users?.length) return null

  return (
    <div className="space-y-2">
      {users.map((user, index) => (
        <LeaderboardUser 
          key={user.id} 
          user={user} 
          rank={index}
        />
      ))}
    </div>
  )
} 