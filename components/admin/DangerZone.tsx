'use client'
import { useState } from 'react'

type DangerZoneProps = {
  onReset: () => void
}

export default function DangerZone({ onReset }: DangerZoneProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {
    if (!showConfirm) {
      setShowConfirm(true)
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/admin/reset', {
        method: 'POST'
      })

      if (response.ok) {
        onReset()
        setShowConfirm(false)
      }
    } catch (error) {
      console.error('Reset error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-dark-secondary rounded-xl p-6 border border-red-500/20 shadow-lg opacity-0 animate-fade-in delay-400">
      <h2 className="text-xl font-bold mb-2 text-red-500">Zone Dangereuse</h2>
      <p className="text-gray-400 text-sm mb-4">
        Ces actions sont irréversibles. Soyez sûr de ce que vous faites.
      </p>
      
      <div className="space-y-4">
        {showConfirm ? (
          <div className="p-4 border border-red-500/20 rounded-lg bg-red-500/5">
            <p className="text-red-400 mb-4">
              Êtes-vous sûr ? Cette action va :
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Réinitialiser tous les LKD à 1000</li>
                <li>Supprimer tous les paris et leur historique</li>
                <li>Supprimer tous les transferts</li>
                <li>Retirer tous les titres et animations</li>
              </ul>
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                disabled={loading}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors disabled:opacity-50"
              >
                {loading ? 'Réinitialisation...' : 'Oui, tout réinitialiser'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="px-4 py-2 bg-dark-accent hover:bg-dark-accent/70 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleReset}
            className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
          >
            Réinitialiser tout le système
          </button>
        )}
      </div>
    </div>
  )
} 