export type User = {
  id: number
  username: string
  balance: number
  title: string | null
  animation: string | null
  isAdmin?: boolean
  customTitle?: string
}

export type BetEvent = {
  id: number
  question: string
  isActive: boolean
  result: boolean | null
  createdAt: string
}

export type Bet = {
  id: number
  amount: number
  choice: boolean
  createdAt: string
  betEvent: {
    question: string
    result: boolean | null
  }
} 