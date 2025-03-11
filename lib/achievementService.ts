import { PrismaClient } from '@prisma/client'
import { ACHIEVEMENTS } from './achievements'
import { TITLES, ANIMATIONS } from './shop'

const prisma = new PrismaClient()

export async function checkAchievements(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      bets: {
        orderBy: { createdAt: 'desc' },
        include: { betEvent: true }
      },
      achievements: true
    }
  })

  if (!user) return

  const newAchievements = []
  const userAchievementIds = user.achievements.map(a => a.id)

  // Vérifier premier pari gagné
  const hasWonBet = user.bets.some(bet => 
    bet.betEvent.result !== null && bet.choice === bet.betEvent.result
  )
  if (hasWonBet && !userAchievementIds.includes(ACHIEVEMENTS.FIRST_WIN.id)) {
    newAchievements.push(ACHIEVEMENTS.FIRST_WIN.id)
  }

  // Vérifier séries de victoires et défaites
  let winStreak = 0
  let loseStreak = 0
  for (const bet of user.bets) {
    if (!bet.betEvent.result) continue

    if (bet.choice === bet.betEvent.result) {
      winStreak++
      loseStreak = 0
    } else {
      loseStreak++
      winStreak = 0
    }
  }

  // Séries de victoires
  if (winStreak >= 3 && !userAchievementIds.includes(ACHIEVEMENTS.WIN_STREAK_3.id)) {
    newAchievements.push(ACHIEVEMENTS.WIN_STREAK_3.id)
  }
  if (winStreak >= 6 && !userAchievementIds.includes(ACHIEVEMENTS.WIN_STREAK_6.id)) {
    newAchievements.push(ACHIEVEMENTS.WIN_STREAK_6.id)
  }
  if (winStreak >= 10 && !userAchievementIds.includes(ACHIEVEMENTS.WIN_STREAK_10.id)) {
    newAchievements.push(ACHIEVEMENTS.WIN_STREAK_10.id)
  }

  // Séries de défaites
  if (loseStreak >= 5 && !userAchievementIds.includes(ACHIEVEMENTS.LOSE_STREAK_5.id)) {
    newAchievements.push(ACHIEVEMENTS.LOSE_STREAK_5.id)
  }
  if (loseStreak >= 10 && !userAchievementIds.includes(ACHIEVEMENTS.LOSE_STREAK_10.id)) {
    newAchievements.push(ACHIEVEMENTS.LOSE_STREAK_10.id)
  }

  // Vérifier paliers de LKD
  if (user.balance >= 2000 && !userAchievementIds.includes(ACHIEVEMENTS.BALANCE_2000.id)) {
    newAchievements.push(ACHIEVEMENTS.BALANCE_2000.id)
  }
  if (user.balance >= 5000 && !userAchievementIds.includes(ACHIEVEMENTS.BALANCE_5000.id)) {
    newAchievements.push(ACHIEVEMENTS.BALANCE_5000.id)
  }
  if (user.balance >= 10000 && !userAchievementIds.includes(ACHIEVEMENTS.BALANCE_10000.id)) {
    newAchievements.push(ACHIEVEMENTS.BALANCE_10000.id)
  }
  if (user.balance >= 100000 && !userAchievementIds.includes(ACHIEVEMENTS.BALANCE_100000.id)) {
    newAchievements.push(ACHIEVEMENTS.BALANCE_100000.id)
  }

  // Vérifier SDF (0 LKD)
  if (user.balance === 0 && !userAchievementIds.includes(ACHIEVEMENTS.BROKE.id)) {
    newAchievements.push(ACHIEVEMENTS.BROKE.id)
  }

  // Vérifier les titres et animations
  const ownedTitles = JSON.parse(user.ownedTitles)
  const ownedAnimations = JSON.parse(user.ownedAnimations)

  // Vérifier "J'adore le caca"
  if (ownedTitles.includes('gros_caca') && !userAchievementIds.includes(ACHIEVEMENTS.POOP_LOVER.id)) {
    newAchievements.push(ACHIEVEMENTS.POOP_LOVER.id)
  }

  // Vérifier "Pigeon"
  if (
    ownedTitles.length === TITLES.length && 
    ownedAnimations.length === ANIMATIONS.length &&
    !userAchievementIds.includes(ACHIEVEMENTS.COLLECTOR.id)
  ) {
    newAchievements.push(ACHIEVEMENTS.COLLECTOR.id)
  }

  // Attribuer les nouveaux achievements
  if (newAchievements.length > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        achievements: {
          connect: newAchievements.map(id => ({ id }))
        }
      }
    })
  }
} 