import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: { username }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Nom d\'utilisateur déjà pris' },
        { status: 400 }
      )
    }

    // Créer le nouvel utilisateur
    const user = await prisma.user.create({
      data: {
        username,
        password,
        balance: 200, // Balance initiale de 200 LKD
        ownedTitles: '[]',
        ownedAnimations: '[]'
      }
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 