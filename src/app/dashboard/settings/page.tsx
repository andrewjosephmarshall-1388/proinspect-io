'use client'
import { useState } from 'react'
import { Save, Upload, CreditCard, Building } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: 'Smith Home Inspections',
    name: 'John Smith',
    email: 'john@smithinspections.com',
    phone: '(512) 555-1234',
    primaryColor: '#2563EB',
    platformFee: '5'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value })
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      <div className="settings-grid">
        <div className="card">
          <h2>Profile Settings</h2>
          <form className="settings-form">
            <div className="form-group">
              <label className="label">Company Name</label>
              <input type="text" name="companyName" className="input" value={settings.companyName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="label">Your Name</label>
              <input type="text" name="name" className="input" value={settings.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="label">Email</label>
              <input type="email" name="email" className="input" value={settings.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="label">Phone</label>
              <input type="tel" name="phone" className="input" value={settings.phone} onChange={handleChange} />
            </div>
            <button type="button" className="btn btn-primary">
              <Save size={18} />
              Save Changes
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Branding</h2>
          <div className="logo-upload">
            <div className="logo-preview">
              {settings.companyName.charAt(0)}
            </div>
            <div className="logo-actions">
              <button className="btn btn-secondary">
                <Upload size={18} />
                Upload Logo
              </button>
              <p className="help-text">PNG or JPG, max 2MB. Recommended: 200x200px</p>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="label">Primary Color</label>
            <div className="color-input">
              <input type="color" name="primaryColor" value={settings.primaryColor} onChange={handleChange} />
              <input type="text" name="primaryColor" className="input" value={settings.primaryColor} onChange={handleChange} style={{ width: '100px' }} />
            </div>
          </div>
        </div>

        <div className="card">
          <h2>
            <CreditCard size={20} />
            Stripe Connect
          </h2>
          <div className="stripe-status">
            <div className="status-info">
              <span className="status-label">Connection Status</span>
              <span className="status-value connected">Connected</span>
            </div>
            <button className="btn btn-secondary">Manage Stripe Account</button>
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="label">Platform Fee (%)</label>
            <input type="number" name="platformFee" className="input" value={settings.platformFee} onChange={handleChange} style={{ width: '100px' }} />
            <p className="help-text">Fee taken from each payment</p>
          </div>
        </div>

        <div className="card">
          <h2>
            <Building size={20} />
            Business Details
          </h2>
          <p className="help-text">Business information shown on reports</p>
          <div className="form-group">
            <label className="label">Business Address</label>
            <input type="text" className="input" placeholder="123 Main St, Austin, TX 78701" />
          </div>
          <div className="form-group">
            <label className="label">License Number</label>
            <input type="text" className="input" placeholder="TREC #12345" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem; }
        .card h2 { display: flex; align-items: center; gap: 0.5rem; font-size: 1.125rem; font-weight: 600; margin-bottom: 1.25rem; }
        .settings-form { display: flex; flex-direction: column; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; }
        .logo-upload { display: flex; gap: 1.5rem; align-items: center; }
        .logo-preview { width: 80px; height: 80px; background: var(--primary); color: white; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; }
        .help-text { font-size: 0.875rem; color: var(--gray-500); margin-top: 0.25rem; }
        .color-input { display: flex; align-items: center; gap: 0.75rem; }
        .color-input input[type="color"] { width: 40px; height: 40px; border: none; border-radius: 0.5rem; cursor: pointer; }
        .stripe-status { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--gray-50); border-radius: 0.5rem; }
        .status-info { display: flex; flex-direction: column; }
        .status-label { font-size: 0.875rem; color: var(--gray-500); }
        .status-value { font-weight: 600; }
        .status-value.connected { color: var(--success); }
      `}</style>
    </div>
  )
}
