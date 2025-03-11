import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const currentBet = await prisma.betEvent.findFirst({
      where: { 
        isActive: true,
        result: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!currentBet) {
      return NextResponse.json(
        { error: 'Aucun pari actif' },
        { status: 404 }
      )
    }

    return NextResponse.json(currentBet)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 