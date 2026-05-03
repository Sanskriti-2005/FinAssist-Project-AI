import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'FinAssist - Savings Calculator',
  description: 'AI-powered financial assistant for savings planning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main style={{ flex: 1, marginLeft: '280px', padding: '24px', minHeight: '100vh' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}