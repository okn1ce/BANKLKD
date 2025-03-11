export function UserTitle({ title, customTitle }) {
  if (!title) return null

  const titleConfig = TITLES.find(t => t.id === title)
  if (!titleConfig) return null

  // Si c'est un titre personnalisé, on affiche le titre choisi par l'utilisateur
  const displayName = titleConfig.isCustom ? customTitle : titleConfig.name

  return (
    <span className={`${titleConfig.css || ''}`}>
      {displayName}
    </span>
  )
} 