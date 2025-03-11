import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Récupérer le pari actif
    const activeBet = await prisma.betEvent.findFirst({
      where: { isActive: true },
      select: {
        id: true,
        bets: {
          select: {
            amount: true,
            choice: true,
            user: {
              select: {
                username: true,
                title: true
              }
            },
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!activeBet) {
      return NextResponse.json({
        totalBettors: 0,
        totalAmount: 0,
        yesAmount: 0,
        noAmount: 0,
        yesBettors: 0,
        noBettors: 0,
        bets: []
      })
    }

    const yesStats = activeBet.bets.filter(bet => bet.choice)
    const noStats = activeBet.bets.filter(bet => !bet.choice)

    return NextResponse.json({
      totalBettors: activeBet.bets.length,
      totalAmount: activeBet.bets.reduce((sum, bet) => sum + bet.amount, 0),
      yesAmount: yesStats.reduce((sum, bet) => sum + bet.amount, 0),
      noAmount: noStats.reduce((sum, bet) => sum + bet.amount, 0),
      yesBettors: yesStats.length,
      noBettors: noStats.length,
      bets: activeBet.bets.map(bet => ({
        username: bet.user.username,
        title: bet.user.title,
        amount: bet.amount,
        choice: bet.choice,
        createdAt: bet.createdAt
      }))
    })
  } catch (error) {
    console.error('Current bet stats error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 