'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TITLES, ANIMATIONS, TEMPORARY_ITEMS } from '../../lib/shop'
import LoadingSpinner from '@/components/LoadingSpinner'

function formatTimeLeft(endsAt: Date) {
  const now = new Date()
  const diff = endsAt.getTime() - now.getTime()
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  if (days > 0) {
    return `${days}j ${hours}h ${minutes}m ${seconds}s`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
}

export default function ShopPage() {
  const [user, setUser] = useState(null)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [, forceUpdate] = useState({})

  // Filtrer les items temporaires non expirés et non possédés
  const activeTemporaryItems = TEMPORARY_ITEMS.filter(item => {
    const now = new Date()
    const ownedItems = item.type === 'title'
      ? JSON.parse(user?.ownedTitles || '[]')
      : JSON.parse(user?.ownedAnimations || '[]')
    return item.endsAt.getTime() > now.getTime() && !ownedItems.includes(item.id)
  })

  // Obtenir les titres possédés et les trier par prix
  const ownedTitles = [...TITLES]
  const temporaryTitles = TEMPORARY_ITEMS
    .filter(item => item.type === 'title' && JSON.parse(user?.ownedTitles || '[]').includes(item.id))
  ownedTitles.push(...temporaryTitles)
  const sortedTitles = ownedTitles.sort((a, b) => a.price - b.price)

  // Obtenir les animations possédées et les trier par prix
  const ownedAnimations = [...ANIMATIONS]
  const temporaryAnimations = TEMPORARY_ITEMS
    .filter(item => item.type === 'animation' && JSON.parse(user?.ownedAnimations || '[]').includes(item.id))
  ownedAnimations.push(...temporaryAnimations)
  const sortedAnimations = ownedAnimations.sort((a, b) => a.price - b.price)

  // Trier les items temporaires par prix
  const sortedTemporaryItems = activeTemporaryItems.sort((a, b) => {
    const priceA = a.discount ? Math.round(a.price * (1 - a.discount / 100)) : a.price
    const priceB = b.discount ? Math.round(b.price * (1 - b.discount / 100)) : b.price
    return priceA - priceB
  })

  useEffect(() => {
    fetchUser()
    const timer = setInterval(() => {
      forceUpdate({}) // Force la mise à jour pour le décompte et le filtrage
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const fetchUser = async () => {
    const response = await fetch('/api/user')
    if (response.ok) {
      const data = await response.json()
      setUser(data.user)
    }
    setLoading(false)
  }

  const buyItem = async (type: 'title' | 'animation', itemId: string) => {
    try {
      const response = await fetch('/api/shop/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, itemId })
      })
      
      if (response.ok) {
        fetchUser()
      }
    } catch (error) {
      console.error('Error buying item:', error)
    }
  }

  const equipItem = async (type: 'title' | 'animation', itemId: string | null) => {
    try {
      const response = await fetch('/api/shop/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, itemId })
      })

      if (response.ok) {
        fetchUser()
      }
    } catch (error) {
      console.error('Erreur lors de l\'équipement')
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
          <h1 className="text-2xl font-bold">Magasin</h1>
          <div className="flex items-center gap-4">
            <span className="text-accent-secondary font-medium">
              {user?.balance} LKD
            </span>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-dark-secondary hover:bg-dark-accent rounded-lg border border-accent-tertiary/20 hover:border-accent-tertiary/40 transition-all group"
            >
              <span className="text-accent-tertiary group-hover:scale-105 transition-transform inline-block">
                ← Retour
              </span>
            </button>
          </div>
        </div>

        {/* Section Titres */}
        <div className="bg-dark-secondary rounded-xl p-6 border border-dark-accent shadow-lg opacity-0 animate-fade-in delay-100">
          <h2 className="text-xl font-bold mb-4">Titres</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedTitles.map((title) => (
              <div
                key={title.id}
                className="border border-dark-accent rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm text-accent-tertiary ${title.css || ''}`}>
                      {title.name}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="font-medium">Pseudo</span>
                  </div>
                  <div className="text-sm text-gray-400">{title.price} LKD</div>
                </div>
                <div className="flex gap-2">
                  {JSON.parse(user?.ownedTitles || '[]').includes(title.id) ? (
                    <button
                      onClick={() => equipItem('title', user.title === title.id ? null : title.id)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        user.title === title.id
                          ? 'bg-accent-secondary/20 text-accent-secondary'
                          : 'bg-dark-accent hover:bg-dark-accent/70 text-white'
                      }`}
                    >
                      {user.title === title.id ? 'Équipé' : 'Équiper'}
                    </button>
                  ) : (
                    <button
                      onClick={() => buyItem('title', title.id)}
                      disabled={user?.balance < title.price}
                      className="px-4 py-2 bg-accent-tertiary hover:bg-accent-tertiary/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Acheter
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Animations */}
        <div className="bg-dark-secondary rounded-xl p-6 border border-dark-accent shadow-lg opacity-0 animate-fade-in delay-200">
          <h2 className="text-xl font-bold mb-4">Animations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedAnimations.map((animation) => (
              <div
                key={animation.id}
                className="border border-dark-accent rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <div className="space-y-2">
                    <span className="block text-gray-400 text-sm">
                      {animation.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${animation.css}`}>
                        Exemple
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">{animation.price} LKD</div>
                </div>
                <div className="flex gap-2">
                  {JSON.parse(user?.ownedAnimations || '[]').includes(animation.id) ? (
                    <button
                      onClick={() => equipItem('animation', user.animation === animation.id ? null : animation.id)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        user.animation === animation.id
                          ? 'bg-accent-secondary/20 text-accent-secondary'
                          : 'bg-dark-accent hover:bg-dark-accent/70 text-white'
                      }`}
                    >
                      {user.animation === animation.id ? 'Équipée' : 'Équiper'}
                    </button>
                  ) : (
                    <button
                      onClick={() => buyItem('animation', animation.id)}
                      disabled={user?.balance < animation.price}
                      className="px-4 py-2 bg-accent-tertiary hover:bg-accent-tertiary/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Acheter
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Items Temporaires */}
        {sortedTemporaryItems.length > 0 && (
          <div className="bg-dark-secondary rounded-xl p-6 border border-dark-accent shadow-lg opacity-0 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Shop Temporaire</h2>
              <span className="text-sm text-accent-tertiary">Items limités dans le temps</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedTemporaryItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-dark-accent rounded-lg p-4 space-y-3 relative overflow-hidden"
                >
                  {item.discount && (
                    <div className="absolute top-2 right-2 bg-accent-secondary/20 text-accent-secondary px-2 py-1 rounded-full text-sm font-medium">
                      -{item.discount}%
                    </div>
                  )}
                  
                  <div>
                    {item.type === 'title' ? (
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${item.css}`}>
                          {item.name}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="font-medium">Pseudo</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <span className="block text-gray-400 text-sm">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${item.css}`}>
                            Exemple
                          </span>
                        </div>
                      </div>
                    )}
                    {item.description && (
                      <div className="text-sm text-gray-400 mt-1">
                        {item.description}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-400">
                        {formatTimeLeft(item.endsAt)}
                      </div>
                      <div className="flex items-center gap-2">
                        {item.discount && (
                          <span className="text-sm text-gray-400 line-through">
                            {item.price} LKD
                          </span>
                        )}
                        <span className="font-medium text-accent-secondary">
                          {item.discount 
                            ? Math.round(item.price * (1 - item.discount / 100))
                            : item.price} LKD
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {(item.type === 'title' 
                        ? JSON.parse(user?.ownedTitles || '[]')
                        : JSON.parse(user?.ownedAnimations || '[]')
                      ).includes(item.id) ? (
                        <button
                          onClick={() => equipItem(
                            item.type,
                            item.type === 'title' 
                              ? (user.title === item.id ? null : item.id)
                              : (user.animation === item.id ? null : item.id)
                          )}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            (item.type === 'title' ? user.title : user.animation) === item.id
                              ? 'bg-accent-secondary/20 text-accent-secondary'
                              : 'bg-dark-accent hover:bg-dark-accent/70 text-white'
                          }`}
                        >
                          {(item.type === 'title' ? user.title : user.animation) === item.id 
                            ? 'Équipé' 
                            : 'Équiper'}
                        </button>
                      ) : (
                        <button
                          onClick={() => buyItem(item.type, item.id)}
                          disabled={user?.balance < (item.discount 
                            ? Math.round(item.price * (1 - item.discount / 100))
                            : item.price)}
                          className="px-4 py-2 bg-accent-tertiary hover:bg-accent-tertiary/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Acheter
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 