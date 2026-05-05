'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaBars, FaXmark, FaMoon, FaSun, FaHeart, FaRightFromBracket } from 'react-icons/fa6'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { LayoutDashboard } from 'lucide-react'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { data: session } = useSession()

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/events', label: 'Events' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/membership', label: 'Membership' },
    { href: '/contact', label: 'Contact' },
    { href: '/donate', label: 'Donate' },
    ...(session ? [{ href: '/dashboard/overview', label: 'Dashboard' }] : []),
  ]

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
    setIsOpen(false)
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white dark:bg-background/95 dark:backdrop-blur dark:supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Name */}
          <Link href="/" className="flex items-center gap-2 group md:gap-3">
            <div className="relative w-8 h-8 md:w-10 md:h-10">
              {mounted && (
                <Image
                  src={theme === 'dark' ? '/logo-dark.png' : '/logo.png'}
                  alt="Benevora Initiative"
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-lg text-primary group-hover:text-accent transition-colors">
                Benevora
              </span>
              <span className="text-xs text-muted-foreground leading-none">Initiative</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive(link.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {link.label === 'Donate' && <FaHeart className="w-4 h-4" />}
                {link.label === 'Dashboard' && <LayoutDashboard className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle, Sign Out and Mobile Menu Button */}
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 cursor-pointer rounded-md hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <FaSun className="w-5 h-5 text-foreground" />
                ) : (
                  <FaMoon className="w-5 h-5 text-primary" />
                )}
              </button>
            )}

            {/* Sign Out Button - Desktop */}
            {session && mounted && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex items-center gap-2 text-foreground hover:text-accent hover:bg-muted"
                  >
                    <FaRightFromBracket className="w-4 h-4" />
                    <span className="text-sm cursor-pointer">Sign Out</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">Sign Out</AlertDialogTitle>
                    <AlertDialogDescription className="text-foreground/70">
                      Are you sure you want to sign out? You&apos;ll need to log in again to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex gap-3 justify-end">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSignOut}
                      className="bg-destructive text-background hover:bg-destructive/90"
                    >
                      Sign Out
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md hover:bg-muted"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FaXmark className="w-6 h-6 text-foreground" />
              ) : (
                <FaBars className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-2 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive(link.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {link.label === 'Donate' && <FaHeart className="w-4 h-4" />}
                {link.label === 'Dashboard' && <LayoutDashboard className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}

            {/* Mobile Sign Out Button */}
            {session && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="px-4 py-2  rounded-md text-sm font-medium transition-all flex items-center gap-2 text-foreground hover:bg-muted w-full justify-start">
                    <FaRightFromBracket className="w-4 h-4" />
                    Sign Out
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">Sign Out</AlertDialogTitle>
                    <AlertDialogDescription className="text-foreground/70">
                      Are you sure you want to sign out? You&apos;ll need to log in again to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex gap-3 justify-end">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSignOut}
                      className="bg-destructive text-background hover:bg-destructive/90"
                    >
                      Sign Out
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
