# ProInspect.io

Professional home inspection software platform.

## Features

- **Multi-tenant platform** - Each inspector gets their own account with custom branding
- **Inspection management** - Create and track inspections (Standard Home, HVAC, Termite, 4-Point, Commercial, Roof, etc.)
- **PDF report generation** - Professional, branded reports with photos
- **Payment processing** - Stripe Connect integration for payments
- **Client portal** - Clients view reports, sign digitally, pay online

## Tech Stack

- Next.js 14 (App Router)
- PostgreSQL + Prisma
- NextAuth.js
- Stripe Connect
- React-PDF for PDF generation

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your values

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### Environment Variables

See `.env.example` for required environment variables.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── auth/         # Login/Signup pages
│   ├── dashboard/    # Inspector dashboard
│   └── page.tsx      # Landing page
├── components/       # Reusable components
├── lib/             # Utility functions
└── styles/          # Global styles

prisma/
└── schema.prisma    # Database schema
```

## Deployment

Deploy to Vercel:

```bash
npm run build
```

## License

MIT
