import { NavLink, Outlet } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useAuth } from '@/auth/AuthProvider'
import Logo from '@/assets/logo.svg'

const NAV_ITEMS: Array<{ to: string; label: string; end?: boolean }> = [
  { to: '/management', label: 'KPI Monitoring', end: true },
  { to: '/management/risk-heatmap', label: 'Risk Heatmap' },
  { to: '/management/lifecycle', label: 'Lifecycle Timeline' },
  { to: '/management/reports', label: 'Reports' },
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
  if (!role) return 'Management'
  return role.charAt(0).toUpperCase() + role.slice(1)
}

export default function ManagementLayout() {
  const nav = useMemo(() => NAV_ITEMS, [])
  const { profile, signOut } = useAuth()
  const displayName = profile?.full_name ?? profile?.email ?? 'OptiMind User'
  const roleLabel = formatRole(profile?.role ?? 'management')
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
              <img src={Logo} alt="OptiMind Logo" className="h-6 w-6" />
            </div>
            <div className="hidden group-hover:block">
              <div className="text-sm font-semibold text-slate-800">OptiMind</div>
              <div className="text-xs text-slate-500">Management Suite</div>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-3">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-[#357ABD] text-white'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <div className="grid h-6 w-6 place-items-center">
                  {item.label === 'KPI Monitoring' && (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3v18h18" />
                      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                    </svg>
                  )}
                  {item.label === 'Risk Heatmap' && (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  )}
                  {item.label === 'Lifecycle Timeline' && (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 6h13" />
                      <path d="M8 12h13" />
                      <path d="M8 18h13" />
                      <path d="M3 6h.01" />
                      <path d="M3 12h.01" />
                      <path d="M3 18h.01" />
                    </svg>
                  )}
                  {item.label === 'Reports' && (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10,9 9,9 8,9" />
                    </svg>
                  )}
                  {item.label === 'Settings' && (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v6m0 6v6" />
                      <path d="m15.5 3.5-3 3-3-3" />
                      <path d="m15.5 20.5-3-3-3 3" />
                      <path d="M1 12h6m6 0h6" />
                      <path d="m3.5 15.5 3-3-3-3" />
                      <path d="m20.5 15.5-3-3 3-3" />
                    </svg>
                  )}
                </div>
                <span className="hidden group-hover:block">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-4 bg-white px-6 py-4 shadow-sm">
          <div className="hidden w-[76px] md:block" aria-hidden />
          <div className="flex flex-1 items-center justify-center">
            <div className="flex w-full max-w-md items-center gap-3 rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-500">
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
                placeholder="Search management data..."
                className="w-full border-none bg-transparent focus:outline-none"
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
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
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