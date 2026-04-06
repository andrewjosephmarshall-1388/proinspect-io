'use client'

import Link from 'next/link'
import { Check, FileText, CreditCard, Users, Building } from 'lucide-react'
import './globals.css'

export default function Home() {
  return (
    <div className="landing">
      <nav className="nav">
        <div className="container nav-content">
          <Link href="/" className="nav-logo">ProInspect.io</Link>
          <div className="nav-links">
            <Link href="/#features">Features</Link>
            <Link href="/#pricing">Pricing</Link>
            <Link href="/auth/login" className="btn btn-secondary">Log In</Link>
            <Link href="/auth/signup" className="btn btn-primary">Start Free Trial</Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container hero-content">
          <h1>Professional Home Inspection Software</h1>
          <p className="hero-subtitle">
            Create stunning PDF reports, process payments, and manage your inspection business — all in one place.
          </p>
          <div className="hero-buttons">
            <Link href="/auth/signup" className="btn btn-primary btn-lg">Start Free Trial</Link>
            <Link href="/auth/login" className="btn btn-secondary btn-lg">See Demo</Link>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title">Everything You Need</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <FileText className="feature-icon" />
              <h3>PDF Reports</h3>
              <p>Professional, branded inspection reports with photos — generated in minutes.</p>
            </div>
            <div className="feature-card">
              <CreditCard className="feature-icon" />
              <h3>Payment Processing</h3>
              <p>Get paid faster with Stripe Connect. Send invoices, accept cards, direct deposit to your bank.</p>
            </div>
            <div className="feature-card">
              <Users className="feature-icon" />
              <h3>Client Portal</h3>
              <p>Your clients can view reports, sign digitally, and pay online — self-service.</p>
            </div>
            <div className="feature-card">
              <Building className="feature-icon" />
              <h3>Multiple Inspection Types</h3>
              <p>Standard Home, HVAC, Termite, 4-Point, Commercial, Roof, Wind Mitigation, and more.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing">
        <div className="container">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Starter</h3>
              <div className="price">$49<span>/month</span></div>
              <ul className="pricing-features">
                <li><Check className="check" /> 10 inspections/month</li>
                <li><Check className="check" /> PDF reports</li>
                <li><Check className="check" /> Client portal</li>
                <li><Check className="check" /> Email support</li>
              </ul>
              <Link href="/auth/signup" className="btn btn-primary btn-block">Get Started</Link>
            </div>
            <div className="pricing-card featured">
              <div className="badge">Most Popular</div>
              <h3>Professional</h3>
              <div className="price">$99<span>/month</span></div>
              <ul className="pricing-features">
                <li><Check className="check" /> Unlimited inspections</li>
                <li><Check className="check" /> PDF reports with photos</li>
                <li><Check className="check" /> Stripe Connect payments</li>
                <li><Check className="check" /> Custom branding</li>
                <li><Check className="check" /> Priority support</li>
              </ul>
              <Link href="/auth/signup" className="btn btn-primary btn-block">Get Started</Link>
            </div>
            <div className="pricing-card">
              <h3>Business</h3>
              <div className="price">$199<span>/month</span></div>
              <ul className="pricing-features">
                <li><Check className="check" /> Everything in Professional</li>
                <li><Check className="check" /> Multiple inspectors</li>
                <li><Check className="check" /> Team management</li>
                <li><Check className="check" /> API access</li>
                <li><Check className="check" /> Dedicated account manager</li>
              </ul>
              <Link href="/auth/signup" className="btn btn-primary btn-block">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 ProInspect.io. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .landing { min-height: 100vh; }
        .nav { background: var(--white); border-bottom: 1px solid var(--gray-200); position: sticky; top: 0; z-index: 100; }
        .nav-content { display: flex; justify-content: space-between; align-items: center; height: 4rem; }
        .nav-logo { font-size: 1.5rem; font-weight: 700; color: var(--primary); }
        .nav-links { display: flex; align-items: center; gap: 1.5rem; }
        .hero { background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%); color: white; padding: 6rem 0; text-align: center; }
        .hero h1 { font-size: 3rem; font-weight: 700; margin-bottom: 1rem; }
        .hero-subtitle { font-size: 1.25rem; color: var(--gray-300); max-width: 600px; margin: 0 auto 2rem; }
        .hero-buttons { display: flex; gap: 1rem; justify-content: center; }
        .btn-lg { padding: 0.875rem 1.75rem; font-size: 1rem; }
        .features { padding: 5rem 0; background: var(--white); }
        .section-title { font-size: 2rem; font-weight: 600; text-align: center; margin-bottom: 3rem; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
        .feature-card { padding: 2rem; border-radius: 0.75rem; background: var(--gray-50); }
        .feature-icon { width: 2.5rem; height: 2.5rem; color: var(--primary); margin-bottom: 1rem; }
        .feature-card h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }
        .feature-card p { color: var(--gray-600); }
        .pricing { padding: 5rem 0; background: var(--gray-50); }
        .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; max-width: 900px; margin: 0 auto; }
        .pricing-card { background: var(--white); border-radius: 0.75rem; padding: 2rem; box-shadow: var(--shadow); position: relative; }
        .pricing-card.featured { border: 2px solid var(--primary); }
        .badge { position: absolute; top: -0.75rem; left: 50%; transform: translateX(-50%); background: var(--primary); color: white; padding: 0.25rem 1rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 600; }
        .pricing-card h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }
        .price { font-size: 2.5rem; font-weight: 700; color: var(--gray-900); }
        .price span { font-size: 1rem; font-weight: 400; color: var(--gray-500); }
        .pricing-features { list-style: none; margin: 1.5rem 0; }
        .pricing-features li { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; color: var(--gray-600); }
        .check { width: 1.25rem; height: 1.25rem; color: var(--success); flex-shrink: 0; }
        .btn-block { width: 100%; }
        .footer { background: var(--gray-900); color: var(--gray-400); padding: 2rem 0; text-align: center; }
      `}</style>
    </div>
  )
}
