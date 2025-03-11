import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function POST() {
  try {
    const userId = cookies().get('userId')?.value
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Vérifier que l'utilisateur est admin
    const admin = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    })

    if (!admin?.isAdmin) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Reset tous les utilisateurs (y compris les admins)
    await prisma.user.updateMany({
      data: {
        balance: 200, // Nouvelle balance initiale
        title: null, // Reset le titre équipé
        animation: null, // Reset l'animation équipée
        ownedTitles: '[]',
        ownedAnimations: '[]'
      }
    })

    // Supprimer tous les paris et transactions
    await prisma.$transaction([
      prisma.bet.deleteMany(),
      prisma.transaction.deleteMany(),
      prisma.$executeRaw`DELETE FROM "_UserAchievements"` // Reset aussi les achievements
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 