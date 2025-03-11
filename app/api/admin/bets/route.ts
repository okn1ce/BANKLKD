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

export async function GET() {
  try {
    const admin = await checkAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const bets = await prisma.betEvent.findMany({
      where: { isActive: true },
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

export async function POST(request: Request) {
  try {
    const admin = await checkAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { question } = await request.json()
    
    const newBet = await prisma.betEvent.create({
      data: {
        question,
        isActive: true
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