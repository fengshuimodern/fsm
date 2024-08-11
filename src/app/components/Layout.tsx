'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CompassIcon, MenuIcon } from './Icons'
import { useState } from 'react'
import { Login } from './Login'
import { Signup } from './Signup'
import { useRouter } from 'next/navigation'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function Layout({ children }) {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const router = useRouter()
  const [user, loading] = useAuthState(auth);

  const handleSuccessfulLogin = () => {
    setShowLogin(false)
    router.push('/dashboard')
  }

  const isOnDashboard = router.pathname === '/dashboard';

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <CompassIcon className="w-6 h-6" />
          <span className="text-xl font-bold">FengShuiModern</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="hover:underline" prefetch={false}>
            Features
          </Link>
          <Link href="/pricing" className="hover:underline" prefetch={false}>
            Pricing
          </Link>
          <Link href="/about" className="hover:underline" prefetch={false}>
            About
          </Link>
          <Link href="/contact" className="hover:underline" prefetch={false}>
            Contact
          </Link>
          <Link href="/planner" className="hover:underline" prefetch={false}>
            Room Planner
          </Link>
          {!user && (
            <>
              <Button variant="ghost" onClick={() => setShowLogin(true)} className="px-4 py-2">Login</Button>
              <Button variant="outline" onClick={() => setShowSignup(true)} className="px-4 py-2">Sign Up</Button>
            </>
          )}
          {user && !isOnDashboard && (
            <Link href="/dashboard" passHref>
              <Button variant="outline" className="px-4 py-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          )}
        </nav>
        <Button variant="ghost" className="md:hidden">
          <MenuIcon className="w-6 h-6" />
        </Button>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-primary text-primary-foreground py-6 px-4 md:px-6 flex items-center justify-between">
        {/* Footer content */}
      </footer>
      <Dialog open={showLogin || showSignup} onOpenChange={() => {
        setShowLogin(false);
        setShowSignup(false);
      }}>
        <DialogContent className="sm:max-w-[425px] p-0 bg-transparent border-none shadow-none">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            {showLogin && <Login onClose={() => setShowLogin(false)} onSuccess={handleSuccessfulLogin} />}
            {showSignup && <Signup onClose={() => setShowSignup(false)} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}