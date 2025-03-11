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

    const bets = await prisma.betEvent.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(bets)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 