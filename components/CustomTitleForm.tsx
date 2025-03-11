'use client'
import { useState } from 'react'

export function CustomTitleForm({ onSubmit }) {
  const [customTitle, setCustomTitle] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (customTitle.length < 3 || customTitle.length > 20) return
    onSubmit(customTitle)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Votre titre personnalisé
        </label>
        <input
          type="text"
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
          maxLength={20}
          className="w-full px-4 py-2 bg-dark-primary rounded-lg border border-dark-accent focus:border-accent-secondary outline-none"
          placeholder="Entre 3 et 20 caractères"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-accent-secondary text-white rounded-lg hover:bg-accent-secondary/90 transition-colors"
      >
        Valider
      </button>
    </form>
  )
} 