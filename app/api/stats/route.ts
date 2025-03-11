import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const userId = cookies().get('userId')?.value

    const [totalBets, totalLkd, allBettors, userBets, userTransfers] = await Promise.all([
      // Nombre total de paris
      prisma.bet.count(),
      
      // Total des LKD en circulation
      prisma.user.aggregate({
        _sum: { balance: true }
      }),
      
      // Tous les utilisateurs avec leurs paris
      prisma.user.findMany({
        select: {
          username: true,
          bets: {
            where: {
              betEvent: {
                isActive: false,
                result: {
                  not: null
                }
              }
            },
            select: {
              choice: true,
              amount: true,
              createdAt: true,
              betEvent: { select: { result: true } }
            }
          },
          _count: {
            select: {
              bets: true
            }
          }
        }
      }),

      // Paris de l'utilisateur connecté
      prisma.bet.findMany({
        where: {
          userId: parseInt(userId),
          betEvent: {
            isActive: false,
            result: {
              not: null
            }
          }
        },
        orderBy: { createdAt: 'asc' },
        include: {
          betEvent: true
        }
      }),

      prisma.transfer.findMany({
        where: {
          OR: [
            { fromUserId: parseInt(userId) },
            { toUserId: parseInt(userId) }
          ]
        },
        orderBy: { createdAt: 'asc' }
      })
    ])

    // Calculer les statistiques de l'utilisateur
    let bestStreak = 0
    let currentStreak = 0
    let worstStreak = 0
    let currentLossStreak = 0
    let totalWon = 0
    let totalLost = 0
    let balance = 1000 // Balance initiale
    const balanceHistory = [{ 
      date: new Date(Math.min(...userBets.map(bet => bet.createdAt.getTime()))).toISOString() || new Date().toISOString(),
      balance 
    }]

    // Créer un tableau combiné de toutes les transactions triées par date
    const transactions = [
      ...userBets.map(bet => ({
        date: bet.createdAt,
        type: 'bet' as const,
        amount: bet.amount,
        won: bet.choice === bet.betEvent.result
      })),
      ...userTransfers.map(transfer => ({
        date: transfer.createdAt,
        type: 'transfer' as const,
        amount: transfer.amount,
        isReceived: transfer.toUserId === parseInt(userId)
      }))
    ].sort((a, b) => a.date.getTime() - b.date.getTime())

    // Calculer l'évolution de la balance
    transactions.forEach(transaction => {
      if (transaction.type === 'bet') {
        if (transaction.won) {
          currentStreak++
          currentLossStreak = 0
          totalWon += transaction.amount * 2
          balance += transaction.amount // On ne soustrait pas le montant du pari car il a déjà été soustrait
        } else {
          currentLossStreak++
          currentStreak = 0
          totalLost += transaction.amount
          balance -= transaction.amount
        }
      } else { // transfer
        if (transaction.isReceived) {
          balance += transaction.amount
        } else {
          balance -= transaction.amount
        }
      }

      bestStreak = Math.max(bestStreak, currentStreak)
      worstStreak = Math.max(worstStreak, currentLossStreak)
      
      balanceHistory.push({
        date: transaction.date.toISOString(),
        balance
      })
    })

    // Calculer le ratio de l'utilisateur
    const totalUserBets = userBets.length
    const wonBets = userBets.filter(bet => bet.choice === bet.betEvent.result).length
    const ratio = totalUserBets > 0 ? (wonBets / totalUserBets) * 100 : 0

    // Trouver le pire parieur (parmi ceux qui ont au moins 5 paris)
    const bettorsWithRatio = allBettors
      .filter(bettor => bettor.bets.length >= 5)
      .map(bettor => {
        const totalBets = bettor.bets.length
        const wonBets = bettor.bets.filter(bet => bet.choice === bet.betEvent.result).length
        const ratio = totalBets > 0 ? (wonBets / totalBets) * 100 : 0

        return {
          username: bettor.username,
          ratio,
          totalBets,
          wonBets
        }
      })
      .sort((a, b) => a.ratio - b.ratio) // Trier par ratio croissant

    const worstBettorStats = bettorsWithRatio[0] || {
      username: 'N/A',
      ratio: 0,
      totalBets: 0,
      wonBets: 0
    }

    return NextResponse.json({
      totalBets,
      totalLkd: totalLkd._sum.balance || 0,
      worstBettor: worstBettorStats,
      userStats: {
        totalBets: totalUserBets,
        wonBets,
        ratio,
        bestStreak,
        worstStreak,
        totalWon,
        totalLost,
        balanceHistory
      }
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 