import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CRM Contable',
  description: 'Sistema de gestión para estudio contable',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  )
}
