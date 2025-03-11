export const ACHIEVEMENTS = {
  FIRST_BET: {
    id: 'FIRST_BET',
    name: 'Premier pari',
    description: 'Place ton premier pari',
    icon: '🎲'
  },
  FIRST_WIN: {
    id: 'FIRST_WIN',
    name: 'Première victoire',
    description: 'Gagne ton premier pari',
    icon: '🏆'
  },
  WIN_STREAK_3: {
    id: 'win_streak_3',
    name: "Parieur en série I",
    description: "Gagner 3 paris d'affilée",
    icon: "FireIcon"
  },
  WIN_STREAK_6: {
    id: 'win_streak_6',
    name: "Parieur en série II",
    description: "Gagner 6 paris d'affilée",
    icon: "BoltIcon"
  },
  WIN_STREAK_10: {
    id: 'win_streak_10',
    name: "Parieur en série III",
    description: "Gagner 10 paris d'affilée",
    icon: "SparklesIcon"
  },
  BALANCE_2000: {
    id: 'balance_2000',
    name: "Banquier I",
    description: "Atteindre 2000 LKD",
    icon: "BanknotesIcon"
  },
  BALANCE_5000: {
    id: 'balance_5000',
    name: "Banquier II",
    description: "Atteindre 5000 LKD",
    icon: "BanknotesIcon"
  },
  BALANCE_10000: {
    id: 'balance_10000',
    name: "Banquier III",
    description: "Atteindre 10000 LKD",
    icon: "BanknotesIcon"
  },
  BALANCE_100000: {
    id: 'balance_100000',
    name: "Banquier IV",
    description: "Atteindre 100000 LKD",
    icon: "BanknotesIcon"
  },
  POOP_LOVER: {
    id: 'poop_lover',
    name: "J'adore le caca",
    description: 'Avoir acheté le titre "gros_caca"',
    icon: "FaceSmileIcon"
  },
  COLLECTOR: {
    id: 'collector',
    name: "Pigeon",
    description: "Avoir acheté toutes les animations et titres",
    icon: "ShoppingCartIcon"
  },
  LOSE_STREAK_5: {
    id: 'lose_streak_5',
    name: "Grosse merde",
    description: "Perdre 5 paris d'affilée",
    icon: "ExclamationTriangleIcon"
  },
  LOSE_STREAK_10: {
    id: 'lose_streak_10',
    name: "Arrête de jouer",
    description: "Perdre 10 paris d'affilée",
    icon: "NoSymbolIcon"
  },
  BROKE: {
    id: 'broke',
    name: "SDF",
    description: "Atteindre 0 LKD",
    icon: "HomeIcon"
  },
  TOP_1: {
    id: 'top_1',
    name: "Point faible ? Trop fort.",
    description: "Atteindre la première place du classement",
    icon: "TrophyIcon"
  },
  LAST_PLACE: {
    id: 'last_place',
    name: "Au fond du trou",
    description: "Être dernier au classement",
    icon: "ArrowTrendingDownIcon"
  }
} as const

export type AchievementId = keyof typeof ACHIEVEMENTS 