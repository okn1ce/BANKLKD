import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const userId = cookies().get('userId')?.value
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer tous les paris terminés
    const completedBetEvents = await prisma.betEvent.findMany({
      where: {
        result: { not: null }, // Paris avec un résultat
        isActive: false // Paris terminés
      },
      include: {
        bets: {
          where: { userId: parseInt(userId) }, // Paris de l'utilisateur
          select: {
            id: true,
            amount: true,
            choice: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Formater les données pour inclure les paris où l'utilisateur n'a pas participé
    const formattedBets = completedBetEvents.map(betEvent => ({
      id: betEvent.id,
      question: betEvent.question,
      result: betEvent.result,
      createdAt: betEvent.createdAt,
      userBet: betEvent.bets[0] || null // Le pari de l'utilisateur s'il existe
    }))

    return NextResponse.json(formattedBets)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 