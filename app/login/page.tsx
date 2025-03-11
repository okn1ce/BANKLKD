'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode })
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        setError('Code d\'accès invalide')
      }
    } catch (err) {
      setError('Une erreur est survenue')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-dark-primary to-dark-secondary">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-accent-primary mb-2">Pari Di Jour</h1>
          <p className="text-gray-400">Entrez votre code d'accès pour continuer</p>
        </div>
        
        <div className="bg-dark-secondary rounded-xl p-8 shadow-lg border border-dark-accent">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                placeholder="Code d'accès"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-4 py-3 bg-dark-accent border-2 border-transparent rounded-lg focus:border-accent-primary transition-colors text-white placeholder-gray-500 outline-none"
              />
            </div>
            
            {error && (
              <div className="text-accent-primary text-sm py-2 px-3 bg-accent-primary/10 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-accent-primary hover:bg-accent-primary/90 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-dark-secondary"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 