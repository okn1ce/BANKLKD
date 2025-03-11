'use client'
import { useState } from 'react'

export default function TransferModal({ onClose, onTransfer }) {
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !recipient || loading) return

    setLoading(true)
    try {
      const response = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(amount),
          recipientUsername: recipient
        })
      })

      if (response.ok) {
        onTransfer()
        onClose()
      } else {
        const data = await response.json()
        setError(data.error || 'Erreur lors du transfert')
      }
    } catch (error) {
      setError('Erreur lors du transfert')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-dark-secondary rounded-xl p-6 w-full max-w-md border border-dark-accent shadow-xl animate-modal">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Transfert de LKD</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Destinataire
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Nom d'utilisateur"
              className="w-full px-4 py-3 bg-dark-accent border-2 border-transparent rounded-lg focus:border-accent-tertiary transition-colors text-white placeholder-gray-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Montant
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Montant"
                className="w-full px-4 py-3 bg-dark-accent border-2 border-transparent rounded-lg focus:border-accent-tertiary transition-colors text-white placeholder-gray-500 outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                LKD
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-accent-primary/10 border border-accent-primary/20 rounded-lg">
              <p className="text-accent-primary text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-dark-accent hover:bg-dark-accent/70 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-accent-tertiary hover:bg-accent-tertiary/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Transférer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 