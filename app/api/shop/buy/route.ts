import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { TITLES, ANIMATIONS, TEMPORARY_ITEMS } from '@/lib/shop'
import { checkAchievements } from '@/lib/achievementService'

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
    
    // Récupérer l'item (permanent ou temporaire)
    const item = type === 'title'
      ? [...TITLES, ...TEMPORARY_ITEMS.filter(i => i.type === 'title')].find(t => t.id === itemId)
      : [...ANIMATIONS, ...TEMPORARY_ITEMS.filter(i => i.type === 'animation')].find(a => a.id === itemId)

    if (!item) {
      return NextResponse.json(
        { error: 'Item non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si l'item temporaire n'est pas expiré
    if (TEMPORARY_ITEMS.find(i => i.id === itemId)) {
      const now = new Date()
      const tempItem = TEMPORARY_ITEMS.find(i => i.id === itemId)
      if (tempItem && tempItem.endsAt.getTime() <= now.getTime()) {
        return NextResponse.json(
          { error: 'Item temporaire expiré' },
          { status: 400 }
        )
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Calculer le prix final (avec réduction si applicable)
    const tempItem = TEMPORARY_ITEMS.find(i => i.id === itemId)
    const finalPrice = tempItem?.discount
      ? Math.round(item.price * (1 - tempItem.discount / 100))
      : item.price

    if (user.balance < finalPrice) {
      return NextResponse.json(
        { error: 'Solde insuffisant' },
        { status: 400 }
      )
    }

    // Mettre à jour l'utilisateur
    const ownedItems = type === 'title'
      ? JSON.parse(user.ownedTitles || '[]')
      : JSON.parse(user.ownedAnimations || '[]')

    if (ownedItems.includes(itemId)) {
      return NextResponse.json(
        { error: 'Item déjà possédé' },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        balance: user.balance - finalPrice,
        ...(type === 'title'
          ? { ownedTitles: JSON.stringify([...ownedItems, itemId]) }
          : { ownedAnimations: JSON.stringify([...ownedItems, itemId]) }
        )
      }
    })

    // Vérifier les achievements après l'achat
    await checkAchievements(parseInt(userId))

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 