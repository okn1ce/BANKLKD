'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Notification = {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  username?: string
  amount?: number
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const eventSource = new EventSource('/api/notifications')
    
    eventSource.onmessage = (event) => {
      const notification = JSON.parse(event.data)
      setNotifications(prev => [...prev, notification])
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id))
      }, 5000)
    }

    return () => eventSource.close()
  }, [])

  return (
    <div className="fixed bottom-6 right-6 space-y-2 z-50">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`p-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-accent-secondary/20 text-accent-secondary' :
              notification.type === 'error' ? 'bg-accent-primary/20 text-accent-primary' :
              'bg-dark-accent text-white'
            }`}
          >
            {notification.username && (
              <span className="font-medium">{notification.username} </span>
            )}
            {notification.message}
            {notification.amount && (
              <span className="font-medium"> {notification.amount.toLocaleString()} LKD</span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
} 