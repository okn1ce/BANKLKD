export const TITLES = [
  // Titres avec emojis
  { id: 'petit_caca', name: '💩 Petit caca', price: 300 },
  { id: 'gros_caca', name: '💩💩 Gros caca', price: 500 },
  { id: 'pronosticeur_addict', name: '🎲 Pronosticeur addict', price: 700 },
  { id: '200iq', name: '🧠 200IQ', price: 900 },
  { id: 'maitre_pronos', name: '👑 Maître des pronos', price: 1000 },
  { id: 'musulman', name: '🕌 Musulman', price: 1200 },
  { id: 'jvous_baise', name: '🔥 J\'vous baise', price: 1500 },
  { id: 'gay_master', name: '🌈 Gay Master', price: 1700 },
  { id: 'skibidi_gyatt', name: '💀 Skibidi Gyatt', price: 2000 },
  
  // Titres colorés/dégradés
  { 
    id: 'riche', 
    name: 'Riche.', 
    price: 10000,
    css: 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 bg-clip-text text-transparent font-bold animate-shine relative after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:animate-shine-line'
  },
  { 
    id: 'nega', 
    name: 'Nega', 
    description: 'en plein Sénégal',
    price: 1500,
    css: 'text-gray-800 font-bold'
  },
  { 
    id: 'haram', 
    name: 'Haram', 
    description: 'Passe le bacon stp',
    price: 2500,
    css: 'text-red-500 font-bold animate-pulse-fast'
  },
  { 
    id: 'roi_prelis', 
    name: 'Roi des prélis', 
    description: 'Un seul mérite ce titre',
    price: 2700,
    css: 'bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent font-bold animate-shine'
  },
  { 
    id: 'brainrot', 
    name: 'Brainrot', 
    description: 'Pieds de cheval',
    price: 500
  },
  { 
    id: 'maitre_sims', 
    name: 'Maitre Sims', 
    description: 'L\'original',
    price: 800
  },
  { 
    id: 'feet_lover', 
    name: 'Feet Lover', 
    description: 'I LOVE FEET',
    price: 1000,
    css: 'text-pink-400 font-bold'
  },
  { 
    id: 'mamak', 
    name: 'MAMAK', 
    description: 'je l\'aime profondément',
    price: 1100,
    css: 'animate-bounce-slow font-bold'
  },
  { 
    id: 'saviez_vous', 
    name: 'Le saviez-vous ?', 
    description: 'le sais-tu ?',
    price: 500
  },
  { 
    id: 'lingan', 
    name: 'LINGAN GULI', 
    description: 'GYATT',
    price: 3900,
    css: 'font-black text-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-rainbow-pulse bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(147,51,234,0.5)] hover:scale-105 transition-transform'
  },
  { 
    id: 'futuru', 
    name: 'FUTURU', 
    description: 'c\'est l\'heure',
    price: 900,
    css: 'text-orange-500 font-bold'
  }
]

export const ANIMATIONS = [
  {
    id: 'rainbow',
    name: 'Gold',
    description: 'Effet doré scintillant',
    price: 9000,
    css: 'animate-rainbow'
  },
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Effet cyberpunk verdâtre',
    price: 2200,
    css: 'animate-matrix'
  },
  {
    id: 'shine',
    name: 'Brillance',
    description: 'Effet de brillance colorée',
    price: 7800,
    css: 'animate-shine'
  },
  {
    id: 'bounce',
    name: 'Rebond',
    description: 'Animation de rebondissement',
    price: 2000,
    css: 'animate-bounce-slow'
  },
  {
    id: 'glitch',
    name: 'Glitch',
    description: 'Effet de glitch cyberpunk',
    price: 6500,
    css: 'animate-glitch'
  },
  {
    id: 'pulse',
    name: 'Pulsation',
    description: 'Animation de pulsation douce',
    price: 1500,
    css: 'animate-pulse-fast'
  }
]

// Ajout des types pour les items temporaires
type TemporaryItem = {
  id: string
  name: string
  price: number
  css: string
  description?: string
  endsAt: Date  // Date de fin de la vente
  type: 'title' | 'animation'
  discount?: number  // Réduction en pourcentage
}

// Liste des items temporaires
export const TEMPORARY_ITEMS: TemporaryItem[] = [
  {
    id: 'jyfus',
    name: 'J\'Y FUS',
    price: 2500,
    type: 'title',
    description: 'Là depuis le début',
    css: 'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent font-bold animate-shine relative after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:animate-shine-line',
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours à partir de maintenant
  },
  {
    id: 'fucktrump',
    name: '🤡 FUCKTRUMP',
    price: 700,
    type: 'title',
    description: 'il est fou',
    css: 'font-bold text-red-500',
    endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 jours à partir de maintenant
  },
  {
    id: 'gaming',
    name: 'Gaming',
    price: 1400,
    type: 'animation',
    description: 'Animation RGB Gaming',
    css: 'animate-gaming font-bold',
    endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 jours à partir de maintenant
  }
] 