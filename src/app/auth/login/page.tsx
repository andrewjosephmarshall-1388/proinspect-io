'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (email && password) {
      router.push('/dashboard')
    } else {
      setError('Please fill in all fields')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-logo">ProInspect.io</Link>
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error">{error}</div>}
          
          <div className="form-group">
            <label className="label">Email</label>
            <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          </div>
          
          <div className="form-group">
            <label className="label">Password</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p className="auth-footer">
          Don't have an account? <Link href="/auth/signup">Start free trial</Link>
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
