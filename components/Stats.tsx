'use client'
import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type DetailedStats = {
  totalBets: number
  totalLkd: number
  worstBettor: {
    username: string
    ratio: number
    totalBets: number
    wonBets: number
  }
  userStats: {
    totalBets: number
    wonBets: number
    ratio: number
    bestStreak: number
    worstStreak: number
    totalWon: number
    totalLost: number
    balanceHistory: {
      date: string
      balance: number
    }[]
  }
}

// Fonction utilitaire pour formater les nombres
function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num)
}

export default function Stats() {
  const [stats, setStats] = useState<DetailedStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching stats:', error)
        setLoading(false)
      })
  }, [])

  if (loading || !stats) return null

  // Configuration du graphique
  const chartData = {
    labels: stats?.userStats?.balanceHistory 
      ? stats.userStats.balanceHistory.map(h => 
          new Date(h.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })
        )
      : [],
    datasets: [
      {
        label: 'Balance LKD',
        data: stats?.userStats?.balanceHistory 
          ? stats.userStats.balanceHistory.map(h => h.balance)
          : [],
        borderColor: '#4DFFB7',
        backgroundColor: 'rgba(77, 255, 183, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#9CA3AF'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#9CA3AF'
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total des paris"
          value={loading ? "Chargement..." : formatNumber(stats?.totalBets ?? 0)}
          textColor="text-accent-secondary"
          loading={loading}
        />
        <StatCard
          title="LKD en circulation"
          value={loading ? "Chargement..." : `${formatNumber(stats?.totalLkd ?? 0)} LKD`}
          textColor="text-accent-secondary"
          loading={loading}
        />
        <StatCard
          title="Votre ratio"
          value={loading ? "Chargement..." : `${stats?.userStats?.ratio?.toFixed(1) ?? '0'}%`}
          subtitle={loading ? "" : `${stats?.userStats?.wonBets ?? 0}/${stats?.userStats?.totalBets ?? 0} paris gagnés`}
          textColor="text-accent-secondary"
          loading={loading}
        />
        <StatCard
          title="Parieur le plus nul"
          value={loading ? "Chargement..." : (stats?.worstBettor?.username ?? 'Aucun')}
          subtitle={loading ? "" : (stats?.worstBettor ? `${stats.worstBettor.ratio.toFixed(1)}% de réussite` : 'Pas assez de données')}
          textColor="text-accent-secondary"
          loading={loading}
        />
      </div>

      {/* Bouton pour afficher/cacher les stats avancées */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full py-3 px-4 bg-dark-secondary hover:bg-dark-accent rounded-xl border border-dark-accent transition-colors flex items-center justify-center gap-2"
      >
        <ChartBarIcon className="w-5 h-5" />
        <span>{showAdvanced ? 'Masquer' : 'Afficher'} les statistiques avancées</span>
      </button>

      {/* Stats détaillées avec animation */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Graphique d'évolution */}
              <motion.div
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                className="bg-dark-secondary rounded-xl p-6 border border-dark-accent"
              >
                <h3 className="text-lg font-bold mb-4">Évolution de la balance</h3>
                <div className="h-64">
                  {stats?.userStats?.balanceHistory?.length ? (
                    <Line data={chartData} options={chartOptions} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      Placez votre premier pari pour voir l'évolution
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Statistiques détaillées */}
              <motion.div
                initial={{ x: 20 }}
                animate={{ x: 0 }}
                className="bg-dark-secondary rounded-xl p-6 border border-dark-accent"
              >
                <h3 className="text-lg font-bold mb-4">Performances</h3>
                <div className="space-y-4">
                  {/* Meilleure série */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowTrendingUpIcon className="w-5 h-5 text-accent-secondary" />
                      <span className="text-gray-300">Meilleure série</span>
                    </div>
                    <span className="text-accent-secondary font-medium">
                      {stats?.userStats?.bestStreak || 0} victoires
                    </span>
                  </div>

                  {/* Pire série */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowTrendingDownIcon className="w-5 h-5 text-accent-primary" />
                      <span className="text-gray-300">Pire série</span>
                    </div>
                    <span className="text-accent-primary font-medium">
                      {stats?.userStats?.worstStreak || 0} défaites
                    </span>
                  </div>

                  {/* Total gagné */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Total gagné</span>
                    <span className="text-accent-secondary font-medium">
                      +{formatNumber(stats?.userStats?.totalWon || 0)} LKD
                    </span>
                  </div>

                  {/* Total perdu */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Total perdu</span>
                    <span className="text-accent-primary font-medium">
                      -{formatNumber(stats?.userStats?.totalLost || 0)} LKD
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Mise à jour du composant StatCard pour gérer l'état de chargement
function StatCard({ title, value, subtitle, textColor, loading }: {
  title: string
  value: string
  subtitle?: string
  textColor?: string
  loading?: boolean
}) {
  return (
    <div className={`bg-dark-secondary rounded-xl p-4 border border-dark-accent ${loading ? 'animate-pulse' : ''}`}>
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      <div className={`text-2xl font-bold ${textColor || 'text-white'}`}>
        {value}
      </div>
      {subtitle && (
        <div className="text-sm text-accent-tertiary mt-1">
          {subtitle}
        </div>
      )}
    </div>
  )
} 