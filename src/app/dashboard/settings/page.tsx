'use client'
import { useState } from 'react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({ companyName: 'Smith Home Inspections', name: 'John Smith', email: 'john@smithinspections.com', primaryColor: '#2563EB' })

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Settings</h1>
      
      <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '600px' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Profile Settings</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Company Name</label><input value={settings.companyName} onChange={(e) => setSettings({...settings, companyName: e.target.value})} style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} /></div>
            <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Your Name</label><input value={settings.name} onChange={(e) => setSettings({...settings, name: e.target.value})} style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} /></div>
            <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Email</label><input value={settings.email} onChange={(e) => setSettings({...settings, email: e.target.value})} style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} /></div>
            <button style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: 500, border: 'none', background: '#2563eb', color: 'white', width: 'fit-content' }}>Save Changes</button>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Branding</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '60px', height: '60px', background: settings.primaryColor, borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.5rem' }}>{settings.companyName.charAt(0)}</div>
            <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Primary Color</label><input type="color" value={settings.primaryColor} onChange={(e) => setSettings({...settings, primaryColor: e.target.value})} style={{ width: '40px', height: '40px' }} /></div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Stripe Connect</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
            <div><span style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280' }}>Connection Status</span><span style={{ fontWeight: 600, color: '#10b981' }}>Connected</span></div>
            <button style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 500, border: '1px solid #d1d5db', background: '#fff' }}>Manage</button>
          </div>
        </div>
      </div>
    </div>
  )
}
