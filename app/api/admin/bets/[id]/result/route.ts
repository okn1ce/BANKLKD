import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

async function checkAdmin() {
  const userId = cookies().get('userId')?.value
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) }
  })

  return user?.isAdmin ? user : null
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await checkAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { result } = await request.json()
    const betId = parseInt(params.id)

    // Mettre à jour le pari
    await prisma.betEvent.update({
      where: { id: betId },
      data: {
        result,
        isActive: false
      }
    })

    // Récupérer tous les paris sur cet événement
    const bets = await prisma.bet.findMany({
      where: { betEventId: betId }
    })

    // Traiter les gains/pertes
    for (const bet of bets) {
      if (bet.choice === result) {
        // Le parieur a gagné, doubler sa mise
        await prisma.user.update({
          where: { id: bet.userId },
          data: {
            balance: {
              increment: bet.amount * 2
            }
          }
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 