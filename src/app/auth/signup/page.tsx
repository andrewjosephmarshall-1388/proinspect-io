'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', companyName: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (formData.name && formData.email && formData.password) {
      router.push('/dashboard')
    } else {
      setError('Please fill in all required fields')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-logo">ProInspect.io</Link>
        <h1>Create your account</h1>
        <p className="auth-subtitle">Start your 14-day free trial</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error">{error}</div>}
          
          <div className="form-group">
            <label className="label">Full Name *</label>
            <input type="text" name="name" className="input" value={formData.name} onChange={handleChange} placeholder="John Smith" />
          </div>
          
          <div className="form-group">
            <label className="label">Company Name</label>
            <input type="text" name="companyName" className="input" value={formData.companyName} onChange={handleChange} placeholder="Smith Inspections" />
          </div>
          
          <div className="form-group">
            <label className="label">Email *</label>
            <input type="email" name="email" className="input" value={formData.email} onChange={handleChange} placeholder="you@company.com" />
          </div>
          
          <div className="form-group">
            <label className="label">Password *</label>
            <input type="password" name="password" className="input" value={formData.password} onChange={handleChange} placeholder="••••••••" />
          </div>
          
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <p className="auth-footer">
          Already have an account? <Link href="/auth/login">Sign in</Link>
        </p>
      </div>

      <style jsx>{`
        .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--gray-50); padding: 1rem; }
        .auth-card { width: 100%; max-width: 400px; background: var(--white); padding: 2rem; border-radius: 0.75rem; box-shadow: var(--shadow-lg); }
        .auth-logo { display: block; font-size: 1.5rem; font-weight: 700; color: var(--primary); text-align: center; margin-bottom: 1.5rem; }
        .auth-card h1 { font-size: 1.5rem; font-weight: 600; text-align: center; margin-bottom: 0.5rem; }
        .auth-subtitle { text-align: center; color: var(--gray-500); margin-bottom: 1.5rem; }
        .auth-form { display: flex; flex-direction: column; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; }
        .btn-full { width: 100%; }
        .error { background: #FEF2F2; color: var(--danger); padding: 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; }
        .auth-footer { text-align: center; margin-top: 1.5rem; color: var(--gray-500); font-size: 0.875rem; }
        .auth-footer a { color: var(--primary); font-weight: 500; }
      `}</style>
    </div>
  )
}
