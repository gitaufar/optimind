import { NavLink, Outlet } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useAuth } from '@/auth/AuthProvider'

const NAV_ITEMS: Array<{ to: string; label: string; end?: boolean }> = [
  { to: '/legal', label: 'Dashboard', end: true },
  { to: '/legal/inbox', label: 'Contract Inbox' },
  { to: '/legal/risk-center', label: 'Risk Center' },
  { to: '/legal/ai-analyzer', label: 'AI Analyzer' },
]

function getInitials(name: string | null | undefined) {
  if (!name) return 'OM'
  const segments = name.trim().split(/\s+/).filter(Boolean)
  if (segments.length === 0) return 'OM'
  const first = segments[0][0]
  const last = segments.length > 1 ? segments[segments.length - 1][0] : segments[0][1] ?? ''
  return `${first ?? ''}${last ?? ''}`.toUpperCase()
}

function formatRole(role: string | null | undefined) {
  if (!role) return 'Legal'
  return role.charAt(0).toUpperCase() + role.slice(1)
}

export default function LegalLayout() {
  const nav = useMemo(() => NAV_ITEMS, [])
  const { profile, signOut } = useAuth()
  const displayName = profile?.full_name ?? profile?.email ?? 'OptiMind User'
  const roleLabel = formatRole(profile?.role ?? 'legal')
  const initials = getInitials(profile?.full_name ?? profile?.email)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    setMenuOpen(false)
    await signOut()
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <aside className="group hidden w-[76px] overflow-hidden bg-white shadow-sm transition-all duration-300 hover:w-60 md:block">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-4 py-5">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#357ABD]/10 text-sm font-semibold text-[#357ABD]">
              OM
            </div>
            <div className="hidden group-hover:block">
              <div className="text-sm font-semibold text-slate-800">OptiMind | ILCS</div>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-2 pb-6">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `group/nav flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200 justify-center group-hover:justify-start ${
                    isActive
                      ? 'bg-[#357ABD] text-white shadow'
                      : 'bg-transparent text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isActive ? 'bg-white' : 'bg-slate-300'
                      } group-hover:bg-white`}
                    />
                    <span
                      className={`hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-150 group-hover:ml-1 group-hover:inline group-hover:opacity-100 ${
                        isActive ? 'text-white group-hover:text-white' : 'text-slate-900 group-hover:text-slate-900'
                      }`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-4 bg-white px-6 py-4 shadow-sm">
          <div className="hidden w-[76px] md:block" aria-hidden />
          <div className="flex flex-1 items-center justify-center">
            <div className="flex w-full max-w-md items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">
              <svg
                className="h-4 w-4 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="16.65" y1="16.65" x2="21" y2="21" />
              </svg>
              <input
                placeholder="Search contracts..."
                className="w-full border-none bg-transparent text-slate-700 focus:outline-none"
              />
            </div>
          </div>
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#357ABD] text-sm font-semibold text-white">
                {initials}
              </div>
              <div className="hidden leading-tight text-left md:block">
                <div className="text-sm font-semibold text-slate-800">{displayName}</div>
                <div className="text-xs text-slate-500 capitalize">{roleLabel}</div>
              </div>
              <svg
                className={`h-4 w-4 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : 'rotate-0'}`}
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-12 z-10 w-44 rounded-xl border border-slate-200 bg-white py-2 text-sm shadow-lg">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-slate-600 hover:bg-slate-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
