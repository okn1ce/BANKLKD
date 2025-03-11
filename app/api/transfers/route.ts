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

    const { amount, recipientUsername } = await request.json()

    // Vérifier le solde de l'expéditeur
    const sender = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    })

    if (!sender || sender.balance < amount) {
      return NextResponse.json(
        { error: 'Solde insuffisant' },
        { status: 400 }
      )
    }

    // Trouver le destinataire
    const recipient = await prisma.user.findUnique({
      where: { username: recipientUsername }
    })

    if (!recipient) {
      return NextResponse.json(
        { error: 'Destinataire non trouvé' },
        { status: 404 }
      )
    }

    // Effectuer le transfert
    await prisma.$transaction([
      prisma.transfer.create({
        data: {
          amount,
          fromUserId: parseInt(userId),
          toUserId: recipient.id
        }
      }),
      prisma.user.update({
        where: { id: parseInt(userId) },
        data: { balance: sender.balance - amount }
      }),
      prisma.user.update({
        where: { id: recipient.id },
        data: { balance: recipient.balance + amount }
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