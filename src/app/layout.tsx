import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ProInspect.io - Professional Home Inspection Software',
  description: 'All-in-one home inspection software for professionals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
