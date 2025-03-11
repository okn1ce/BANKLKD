import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { accessCode } = await request.json()
    
    const user = await prisma.user.findUnique({
      where: { accessCode }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Code d\'accès invalide' },
        { status: 401 }
      )
    }

    // Créer un cookie de session
    cookies().set('userId', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 jours
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 