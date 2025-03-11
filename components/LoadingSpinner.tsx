'use client'

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-primary to-dark-secondary">
      <div className="relative">
        {/* Cercle principal */}
        <div className="w-16 h-16 border-4 border-dark-accent rounded-full animate-spin border-t-accent-secondary"></div>
        
        {/* Texte au centre */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-accent-secondary text-sm animate-pulse">LKD</span>
        </div>
      </div>
    </div>
  )
} 