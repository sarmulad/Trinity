import React from "react"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - Trinity Energy',
  description: 'Sign in to Trinity Energy Production Monitoring Platform',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {children}
    </div>
  )
}
