import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/admin/dashboard', label: '📊 Dashboard' },
  { to: '/admin/products', label: '🏷️ Products' },
  { to: '/admin/orders', label: '📦 Orders' },
  { to: '/admin/users', label: '👥 Users' },
  { to: '/admin/coupons', label: '🎟️ Coupons' },
]

export default function AdminLayout({ children }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-56 bg-white dark:bg-gray-800 shadow-sm flex flex-col hidden md:flex">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <p className="font-bold text-primary text-lg">Posticky Admin</p>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-sm transition ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile top bar */}
        <div className="md:hidden bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between shadow-sm">
          <p className="font-bold text-primary">Posticky Admin</p>
          <div className="flex gap-2 overflow-x-auto">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-xs px-2 py-1 rounded-lg whitespace-nowrap ${
                    isActive ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-400'
                  }`
                }
              >
                {l.label.split(' ')[1]}
              </NavLink>
            ))}
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}
