
import React from 'react'
import Providers from '../providers/providers'

export default function FrontEndLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Providers>
       <main className="min-h-screen bg-background">
      {children}
    </main>
    </Providers>
  
  )
}
