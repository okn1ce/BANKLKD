'use client'
import { useState } from 'react'

export default function DangerZone() {
  return (
    <div className="bg-dark-secondary rounded-xl p-6 border border-red-500/20">
      <h2 className="text-xl font-bold mb-4 text-red-500">Zone Dangereuse</h2>
      <button
        onClick={() => {
          if (confirm('Es-tu sûr de vouloir reset ? Cette action est irréversible.')) {
            fetch('/api/admin/reset', { method: 'POST' })
          }
        }}
        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors"
      >
        Reset tout
      </button>
    </div>
  )
} 