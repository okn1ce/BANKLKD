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

    const { betEventId, amount, choice } = await request.json()

    // Vérifier le solde de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    })

    if (!user || user.balance < amount) {
      return NextResponse.json(
        { error: 'Solde insuffisant' },
        { status: 400 }
      )
    }

    // Créer le pari et mettre à jour le solde
    await prisma.$transaction([
      prisma.bet.create({
        data: {
          userId: parseInt(userId),
          betEventId,
          amount,
          choice
        }
      }),
      prisma.user.update({
        where: { id: parseInt(userId) },
        data: { balance: user.balance - amount }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 