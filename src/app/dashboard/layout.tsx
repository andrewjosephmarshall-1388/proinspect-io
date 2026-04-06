'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, Users, Settings, LogOut, Menu, X, Plus, Search } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/inspections', icon: FileText, label: 'Inspections' },
  { href: '/dashboard/clients', icon: Users, label: 'Clients' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link href="/" className="sidebar-logo">ProInspect.io</Link>
          <button className="mobile-close" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link href="/auth/login" className="nav-item">
            <LogOut size={20} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search inspections, clients..." />
          </div>

          <div className="topbar-actions">
            <Link href="/dashboard/inspections/new" className="btn btn-primary">
              <Plus size={18} />
              New Inspection
            </Link>
            <div className="user-avatar">JD</div>
          </div>
        </header>

        <main className="main-content">
          {children}
        </main>
      </div>

      <style jsx>{`
        .dashboard-layout { display: flex; min-height: 100vh; }
        .sidebar { width: 260px; background: var(--gray-900); color: white; display: flex; flex-direction: column; position: fixed; left: 0; top: 0; bottom: 0; z-index: 200; }
        .sidebar-header { padding: 1rem 1.25rem; border-bottom: 1px solid var(--gray-800); display: flex; justify-content: space-between; align-items: center; }
        .sidebar-logo { font-size: 1.25rem; font-weight: 700; color: var(--primary-light); }
        .mobile-close { display: none; background: none; border: none; color: white; padding: 0.5rem; }
        .sidebar-nav { flex: 1; padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 0.25rem; }
        .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 0.5rem; color: var(--gray-400); transition: all 0.15s; }
        .nav-item:hover { background: var(--gray-800); color: white; }
        .nav-item.active { background: var(--primary); color: white; }
        .sidebar-footer { padding: 1rem; border-top: 1px solid var(--gray-800); }
        .main-wrapper { flex: 1; margin-left: 260px; display: flex; flex-direction: column; }
        .topbar { height: 4rem; background: var(--white); border-bottom: 1px solid var(--gray-200); display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; gap: 1rem; }
        .mobile-menu { display: none; background: none; border: none; color: var(--gray-600); padding: 0.5rem; }
        .search-box { display: flex; align-items: center; gap: 0.5rem; background: var(--gray-100); padding: 0.5rem 1rem; border-radius: 0.5rem; width: 100%; max-width: 400px; }
        .search-box input { border: none; background: none; outline: none; width: 100%; font-size: 0.875rem; }
        .search-box svg { color: var(--gray-400); }
        .topbar-actions { display: flex; align-items: center; gap: 1rem; }
        .user-avatar { width: 2.25rem; height: 2.25rem; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.875rem; }
        .main-content { flex: 1; padding: 1.5rem; background: var(--gray-50); }
        
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); transition: transform 0.3s; }
          .sidebar.open { transform: translateX(0); }
          .mobile-close { display: block; }
          .main-wrapper { margin-left: 0; }
          .mobile-menu { display: block; }
        }
      `}</style>
    </div>
  )
}
