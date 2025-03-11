import { TITLES } from '@/lib/shop'

type UserTitleProps = {
  title: string | null
  customTitle: string | null
}

// Changer en export default
export default function UserTitle({ title, customTitle }: UserTitleProps) {
  if (!title) return null

  const titleConfig = TITLES.find(t => t.id === title)
  if (!titleConfig) return null

  // Si c'est un titre personnalisé, on affiche le titre choisi par l'utilisateur
  if (customTitle && title === 'custom') {
    return <span className="text-accent-tertiary">{customTitle}</span>
  }

  return (
    <span className={`text-sm ${titleConfig.css || 'text-accent-tertiary'}`}>
      {titleConfig.name}
    </span>
  )
} 