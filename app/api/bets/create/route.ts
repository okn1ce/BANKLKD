import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

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

    const { question } = await request.json()

    // Désactiver tous les paris actifs existants
    await prisma.betEvent.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    })

    // Créer le nouveau pari
    const newBet = await prisma.betEvent.create({
      data: { 
        question,
        isActive: true,
        result: null
      }
    })

    return NextResponse.json(newBet)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 