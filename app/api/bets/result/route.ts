import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { checkAchievements } from '@/lib/achievementService'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const userId = cookies().get('userId')?.value
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Vérifier si l'utilisateur est admin
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    })

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const { betId, result } = await request.json()

    // Récupérer le pari et tous les paris associés
    const betEvent = await prisma.betEvent.findUnique({
      where: { id: betId },
      include: { bets: { include: { user: true } } }
    })

    if (!betEvent) {
      return NextResponse.json(
        { error: 'Pari non trouvé' },
        { status: 404 }
      )
    }

    // Mettre à jour le résultat et désactiver le pari
    await prisma.betEvent.update({
      where: { id: betId },
      data: { 
        result,
        isActive: false
      }
    })

    // Distribuer les gains aux gagnants et vérifier les achievements pour chaque parieur
    for (const bet of betEvent.bets) {
      if (bet.choice === result) {
        // Le parieur a gagné, doubler sa mise
        await prisma.user.update({
          where: { id: bet.userId },
          data: { balance: { increment: bet.amount * 2 } }
        })
      }
      
      // Vérifier les achievements pour chaque utilisateur qui a parié
      await checkAchievements(bet.userId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 