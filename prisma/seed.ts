import { PrismaClient } from '@prisma/client'
import { ACHIEVEMENTS } from '../lib/achievements'

const prisma = new PrismaClient()

async function main() {
  // Supprimer toutes les données existantes
  await prisma.user.deleteMany()
  await prisma.bet.deleteMany()
  await prisma.transaction.deleteMany()

  // Créer l'utilisateur admin
  await prisma.user.create({
    data: {
      username: 'admin',
      password: 'admin',
      balance: 200, // Balance initiale de 200 LKD
      isAdmin: true,
      ownedTitles: '[]',
      ownedAnimations: '[]'
    }
  })

  // Créer les nouveaux utilisateurs
  console.log('Création des utilisateurs...')
  const users = [
    {
      username: 'Salemos',
      accessCode: '7844',
      balance: 1000,
      isAdmin: false,
      ownedTitles: '[]',
      ownedAnimations: '[]'
    },
    {
      username: 'LKD07',
      accessCode: '7855',
      balance: 1000,
      isAdmin: false,
      ownedTitles: '[]',
      ownedAnimations: '[]'
    },
    {
      username: 'HLL',
      accessCode: '7866',
      balance: 1000,
      isAdmin: false,
      ownedTitles: '[]',
      ownedAnimations: '[]'
    },
    {
      username: 'Secerio',
      accessCode: '7877',
      balance: 1000,
      isAdmin: false,
      ownedTitles: '[]',
      ownedAnimations: '[]'
    },
    {
      username: 'Angrycat',
      accessCode: '7888',
      balance: 1000,
      isAdmin: false,
      ownedTitles: '[]',
      ownedAnimations: '[]'
    },
    {
      username: 'dog',
      accessCode: '7899',
      balance: 1000,
      isAdmin: true,
      ownedTitles: '[]',
      ownedAnimations: '[]'
    }
  ]

  for (const user of users) {
    await prisma.user.create({
      data: user
    })
  }

  // Créer tous les achievements
  for (const achievement of Object.values(ACHIEVEMENTS)) {
    await prisma.achievement.upsert({
      where: { id: achievement.id },
      update: {
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon
      },
      create: {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon
      }
    })
  }

  console.log('Base de données réinitialisée avec succès')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 