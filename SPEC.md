# ProInspect.io - Home Inspection Software Platform

## Project Overview
- **Name:** ProInspect.io
- **Type:** SaaS Web Application
- **Core Functionality:** A subscription-based platform for home inspectors to create professional inspection reports, process payments via Stripe Connect, and manage their inspection business.
- **Target Users:** Professional home inspectors (solo and multi-inspector firms)

## Features

### Phase 1 - MVP
1. **Multi-tenant Authentication**
   - Inspector signup/login (email + password)
   - Password reset flow
   - Session management

2. **Inspector Dashboard**
   - Overview stats (total inspections, revenue, pending reports)
   - Recent activity feed
   - Quick actions (new inspection, view reports)

3. **Inspection Management**
   - Create new inspection (property address, client info, inspection type)
   - Inspection types: Standard Home, HVAC, Termite/Wood Destroying Organisms, 4-Point, Commercial, Roof, Wind Mitigation, Pool/Spa
   - Status tracking (Scheduled, In Progress, Completed, Delivered)

4. **Report Builder**
   - Section-based report editor (Exterior, Interior, Roofing, Electrical, Plumbing, HVAC, Kitchen, Bathroom, etc.)
   - Photo upload with drag-and-drop
   - Findings selection (Good, Fair, Poor, Repair Needed, Safety Hazard)
   - Notes/comments per section
   - Summary page generation

5. **PDF Report Generation**
   - Branded PDF with inspector's logo/colors
   - Professional layout with photos
   - Digital signature field
   - Client name, address, date

6. **Payment Integration (Stripe Connect)**
   - Platform fee configuration
   - Inspector bank account onboarding
   - Payment processing from clients
   - Payout to inspector's bank

7. **Client Portal**
   - Client views inspection report
   - Digital signature on report
   - Pay for inspection
   - Download PDF report

### Phase 2 (Future)
- Scheduling/calendar
- Realtor CRM
- MLS integration
- Mobile app
- AI-assisted report writing

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js
- **Payments:** Stripe Connect
- **PDF:** React-PDF / @react-pdf/renderer
- **Styling:** CSS Modules or Tailwind (user preference)
- **File Storage:** AWS S3 or compatible (for photos)

## Database Schema (Key Tables)
- `User` - inspectors
- `Client` - inspection clients
- `Inspection` - property inspections
- `InspectionSection` - report sections
- `InspectionPhoto` - photos per section
- `Template` - report templates
- `StripeAccount` - connected accounts

## UI/UX Direction
- Clean, professional look suitable for business users
- Color scheme: Blue primary (#2563EB), white backgrounds, subtle grays
- Responsive design (mobile-friendly for on-site use)
- Dashboard-first approach with sidebar navigation