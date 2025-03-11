export default function UserInfo({ user }) {
  return (
    <div className="bg-dark-secondary rounded-xl p-6 border border-dark-accent shadow-lg">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-accent-secondary font-medium">{user.balance} LKD</span>
            <span className="text-gray-500">•</span>
            <span className="text-sm text-gray-400">Balance</span>
          </div>
        </div>
        {user.isAdmin && (
          <div className="px-3 py-1 bg-accent-primary/10 rounded-full">
            <span className="text-accent-primary text-sm font-medium">Admin</span>
          </div>
        )}
      </div>
    </div>
  )
} 