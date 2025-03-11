import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const userId = cookies().get('userId')?.value
    
    // Si pas d'userId, retourner une erreur 401
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const [user, allUsers] = await Promise.all([
      prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: {
          id: true,
          username: true,
          balance: true,
          title: true,
          animation: true,
          ownedTitles: true,
          ownedAnimations: true,
          isAdmin: true
        }
      }),
      prisma.user.findMany({
        select: {
          id: true,
          username: true,
          balance: true,
          title: true,
          animation: true
        },
        orderBy: { balance: 'desc' }
      })
    ])

    // Si l'utilisateur n'existe pas, retourner une erreur 404
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Log pour déboguer
    console.log('API response:', {
      user,
      leaderboard: allUsers
    })

    return NextResponse.json({
      user,
      leaderboard: allUsers
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 