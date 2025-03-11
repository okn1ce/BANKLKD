type NotificationType = 
  | 'BET_REMINDER'     // Rappel de paris à venir
  | 'FRIEND_BET'       // Un ami a parié
  | 'ACHIEVEMENT'      // Succès débloqué
  | 'LEVEL_UP'        // Montée de niveau
  | 'SPECIAL_EVENT'   // Événement spécial
  | 'CHALLENGE'       // Défi reçu
  | 'REWARD'         // Récompense reçue
  | 'STREAK'         // Série en cours

type Notification = {
  id: string
  type: NotificationType
  title: string
  message: string
  action?: {
    label: string
    url: string
  }
  timestamp: Date
  read: boolean
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
}

export function NotificationCenter() {
  return (
    <div className="fixed bottom-6 right-6 w-96">
      <div className="bg-dark-secondary rounded-xl p-4 border border-dark-accent">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Notifications</h3>
          <button className="text-sm text-accent-secondary">
            Tout marquer comme lu
          </button>
        </div>
        
        {/* Liste des notifications */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {/* ... notifications ... */}
        </div>
      </div>
    </div>
  )
} 