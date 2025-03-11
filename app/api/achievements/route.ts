import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const userId = cookies().get('userId')?.value
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { achievements: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    return NextResponse.json({
      achievements: user.achievements.map(a => a.id)
    })
  } catch (error) {
    console.error('Achievements error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 