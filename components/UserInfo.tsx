'use client'
import { useRouter } from 'next/navigation'
import { User } from '@/lib/types'
import UserTitle from '@/components/UserTitle'

type UserInfoProps = {
  user: User
}

export default function UserInfo({ user }: UserInfoProps) {
  const router = useRouter()

  return (
    <div className="bg-dark-secondary rounded-xl p-6 border border-dark-accent shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <UserTitle title={user.title} customTitle={user.customTitle || null} />
              <span className={user.animation || ''}>
                {user.username}
              </span>
            </div>
            <div className="text-accent-secondary font-medium mt-1">
              {user.balance} LKD
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/profile')}
          className="px-4 py-2 bg-dark-accent hover:bg-dark-accent/70 rounded-lg transition-colors"
        >
          Profil
        </button>
      </div>
    </div>
  )
} 