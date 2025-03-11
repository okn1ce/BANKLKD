'use client'
import { useState } from 'react'

type User = {
  id: number
  username: string
  balance: number
}

export default function BalanceManager({ users }: { users: User[] }) {
  const [selectedUser, setSelectedUser] = useState<number | ''>('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedUser || !amount) return

    try {
      const response = await fetch('/api/admin/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: parseInt(selectedUser.toString()),
          amount: parseInt(amount)
        })
      })

      if (!response.ok) throw new Error('Erreur lors de la mise à jour')

      const data = await response.json()
      setStatus({
        type: 'success',
        message: `Solde de ${data.username} mis à jour : ${data.balance} LKD`
      })
      
      // Reset form
      setAmount('')
      setSelectedUser('')
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Erreur lors de la mise à jour du solde'
      })
    }
  }

  return (
    <div className="bg-dark-secondary rounded-xl p-6 border border-dark-accent">
      <h2 className="text-xl font-bold mb-4">Gestion des LKD</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Utilisateur
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value ? parseInt(e.target.value) : '')}
            className="w-full px-4 py-2 bg-dark-accent rounded-lg border border-dark-accent focus:border-accent-primary outline-none"
          >
            <option value="">Sélectionner un utilisateur</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.balance} LKD)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Montant (négatif pour retirer)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="+/- LKD"
            className="w-full px-4 py-2 bg-dark-accent rounded-lg border border-dark-accent focus:border-accent-primary outline-none"
          />
        </div>

        {status && (
          <div className={`p-3 rounded-lg ${
            status.type === 'success' 
              ? 'bg-green-500/10 text-green-500' 
              : 'bg-red-500/10 text-red-500'
          }`}>
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedUser || !amount}
          className="w-full py-2 px-4 bg-accent-primary hover:bg-accent-primary/90 disabled:opacity-50 disabled:hover:bg-accent-primary text-white font-medium rounded-lg transition-colors"
        >
          Mettre à jour le solde
        </button>
      </form>
    </div>
  )
} 