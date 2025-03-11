import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const userId = cookies().get('userId')?.value
    
    // Vérifier si l'utilisateur est admin
    const admin = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { isAdmin: true }
    })

    if (!admin?.isAdmin) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const { targetUserId, amount } = await req.json()

    // Mettre à jour le solde de l'utilisateur cible
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        balance: {
          increment: amount // amount peut être positif ou négatif
        }
      },
      select: {
        id: true,
        username: true,
        balance: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Admin balance update error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 