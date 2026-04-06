'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, Users, Settings, LogOut, Menu, X, Plus, Search } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/inspections', label: 'Inspections' },
    { href: '/dashboard/clients', label: 'Clients' },
    { href: '/dashboard/settings', label: 'Settings' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '260px', background: '#111827', color: 'white', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, bottom: 0 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1f2937' }}>
          <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3b82f6' }}>ProInspect.io</Link>
        </div>
        
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', color: pathname === item.href ? 'white' : '#9ca3af', background: pathname === item.href ? '#2563eb' : 'transparent' }}>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid #1f2937' }}>
          <Link href="/auth/login" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#9ca3af' }}>
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '4rem', background: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f3f4f6', padding: '0.5rem 1rem', borderRadius: '0.5rem', width: '100%', maxWidth: '400px' }}>
            <Search size={18} style={{ color: '#9ca3af' }} />
            <input type="text" placeholder="Search..." style={{ border: 'none', background: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/dashboard/inspections/new" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: 500, border: 'none', background: '#2563eb', color: 'white' }}>
              <Plus size={18} />New Inspection
            </Link>
            <div style={{ width: '2.25rem', height: '2.25rem', background: '#2563eb', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>JD</div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '1.5rem', background: '#f9fafb' }}>{children}</main>
      </div>
    </div>
  )
}
