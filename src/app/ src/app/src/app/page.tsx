import Link from 'next/link'
import { Check, FileText, CreditCard, Users, Building } from 'lucide-react'

export default function Home() {
  return (
    <div>
      <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2563EB' }}>ProInspect.io</Link>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="/#features" style={{ color: '#6b7280' }}>Features</Link>
            <Link href="/auth/login" className="btn btn-secondary">Log In</Link>
            <Link href="/auth/signup" className="btn btn-primary">Start Free Trial</Link>
          </div>
        </div>
      </nav>

      <section style={{ background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', color: 'white', padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' }}>Professional Home Inspection Software</h1>
        <p style={{ fontSize: '1.25rem', color: '#9ca3af', maxWidth: '600px', margin: '0 auto 2rem' }}>Create stunning PDF reports, process payments, and manage your inspection business — all in one place.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/auth/signup" className="btn btn-primary" style={{ padding: '0.875rem 1.75rem' }}>Start Free Trial</Link>
        </div>
      </section>

      <section style={{ padding: '5rem 1.5rem', background: '#fff' }}>
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>Everything You Need</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ padding: '2rem', borderRadius: '0.75rem', background: '#f9fafb' }}><FileText style={{ width: '2.5rem', height: '2.5rem', color: '#2563eb', marginBottom: '1rem' }} /><h3 style={{ marginBottom: '0.5rem' }}>PDF Reports</h3><p style={{ color: '#6b7280' }}>Professional, branded inspection reports with photos.</p></div>
          <div style={{ padding: '2rem', borderRadius: '0.75rem', background: '#f9fafb' }}><CreditCard style={{ width: '2.5rem', height: '2.5rem', color: '#2563eb', marginBottom: '1rem' }} /><h3 style={{ marginBottom: '0.5rem' }}>Payment Processing</h3><p style={{ color: '#6b7280' }}>Get paid faster with Stripe Connect integration.</p></div>
          <div style={{ padding: '2rem', borderRadius: '0.75rem', background: '#f9fafb' }}><Users style={{ width: '2.5rem', height: '2.5rem', color: '#2563eb', marginBottom: '1rem' }} /><h3 style={{ marginBottom: '0.5rem' }}>Client Portal</h3><p style={{ color: '#6b7280' }}>Clients view reports, sign digitally, pay online.</p></div>
          <div style={{ padding: '2rem', borderRadius: '0.75rem', background: '#f9fafb' }}><Building style={{ width: '2.5rem', height: '2.5rem', color: '#2563eb', marginBottom: '1rem' }} /><h3 style={{ marginBottom: '0.5rem' }}>Multiple Inspection Types</h3><p style={{ color: '#6b7280' }}>Standard, HVAC, Termite, Commercial, Roof & more.</p></div>
        </div>
      </section>

      <footer style={{ background: '#111827', color: '#9ca3af', padding: '2rem 1.5rem', textAlign: 'center' }}><p>© 2026 ProInspect.io. All rights reserved.</p></footer>
    </div>
  )
}
