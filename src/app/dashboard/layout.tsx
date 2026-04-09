'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, FileText, Users, Settings, LogOut, Plus, Search } from 'lucide-react'
import { createBrowserClientFromParams } from '@/utils/supabase/client'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSupabase(createBrowserClientFromParams())
  }, [])

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getUser().then(({ data }: { data: { user: any } }) => {
      if (!data?.user) {
        router.push('/auth/login')
      } else if (data.user.email) {
        setUserEmail(data.user.email)
      }
      setLoading(false)
    })
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/inspections', label: 'Inspections' },
    { href: '/dashboard/clients', label: 'Clients' },
    { href: '/dashboard/settings', label: 'Settings' },
  ]

  const getInitials = (email: string) => {
    if (!email) return 'U'
    const parts = email.split('@')[0].split('.')
    return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading || !userEmail) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>Loading...</div>
      </div>
    )
  }

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
          <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontSize: '1rem' }}>
            <span>Logout</span>
          </button>
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
            <div style={{ width: '2.25rem', height: '2.25rem', background: '#2563eb', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>{getInitials(userEmail)}</div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '1.5rem', background: '#f9fafb' }}>{children}</main>
      </div>
    </div>
  )
}