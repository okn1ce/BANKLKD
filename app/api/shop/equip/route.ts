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

    const { type, itemId } = await request.json()

    // Vérifier que l'utilisateur possède l'item
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    const ownedItems = type === 'title' 
      ? JSON.parse(user.ownedTitles || '[]')
      : JSON.parse(user.ownedAnimations || '[]')

    if (itemId && !ownedItems.includes(itemId)) {
      return NextResponse.json(
        { error: 'Item non possédé' },
        { status: 400 }
      )
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        ...(type === 'title' 
          ? { title: itemId }
          : { animation: itemId }
        )
      }
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 