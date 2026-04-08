'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', companyName: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    try {
      // Sign up the user with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            company_name: formData.companyName
          }
        }
      })

      if (signUpError) {
        setError(signUpError.message)
      } else if (data.user) {
        // User created successfully
        setSuccess(true)
        // Optionally redirect to login after a delay
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Signup error:', err)
    }
    
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-logo">ProInspect.io</Link>
        <h1>Create your account</h1>
        <p className="auth-subtitle">Start your 14-day free trial</p>
        
        {success ? (
          <div className="success-message">
            <h2>Check your email!</h2>
            <p>We've sent a confirmation link to <strong>{formData.email}</strong>.</p>
            <p>Click the link to activate your account.</p>
            <p className="resend-note">
              Didn't receive it? Check your spam folder, or{' '}
              <Link href="/auth/login">try again</Link>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error">{error}</div>}
            
            <div className="form-group">
              <label className="label">Full Name *</label>
              <input 
                type="text" 
                name="name" 
                className="input" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="John Smith"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="label">Company Name</label>
              <input 
                type="text" 
                name="companyName" 
                className="input" 
                value={formData.companyName} 
                onChange={handleChange} 
                placeholder="Smith Inspections"
              />
            </div>
            
            <div className="form-group">
              <label className="label">Email *</label>
              <input 
                type="email" 
                name="email" 
                className="input" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="you@company.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="label">Password *</label>
              <input 
                type="password" 
                name="password" 
                className="input" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}
        
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
        .label { font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; }
        .input { padding: 0.75rem; border: 1px solid var(--gray-200); border-radius: 0.5rem; font-size: 1rem; }
        .input:focus { outline: none; border-color: var(--primary); }
        .btn { padding: 0.75rem 1rem; border-radius: 0.5rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .btn-primary { background: var(--primary); color: white; border: none; }
        .btn-primary:hover { opacity: 0.9; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-full { width: 100%; }
        .error { background: #FEF2F2; color: var(--danger); padding: 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; }
        .success-message { text-align: center; padding: 1rem; }
        .success-message h2 { color: var(--primary); margin-bottom: 1rem; }
        .resend-note { font-size: 0.875rem; color: var(--gray-500); margin-top: 1rem; }
        .auth-footer { text-align: center; margin-top: 1.5rem; color: var(--gray-500); font-size: 0.875rem; }
        .auth-footer a { color: var(--primary); font-weight: 500; }
      `}</style>
    </div>
  )
}