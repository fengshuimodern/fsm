import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from "lucide-react";

interface LoginProps {
  onClose: () => void
}

export function Login({ onClose }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [savePassword, setSavePassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail')
    const savedPassword = localStorage.getItem('savedPassword')
    if (savedEmail && savedPassword) {
      setEmail(savedEmail)
      setPassword(savedPassword)
      setSavePassword(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      if (savePassword) {
        localStorage.setItem('savedEmail', email)
        localStorage.setItem('savedPassword', password)
      } else {
        localStorage.removeItem('savedEmail')
        localStorage.removeItem('savedPassword')
      }
      onClose()
      router.push('/dashboard')
    } catch (error) {
      setError('Failed to log in. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} onKeyPress={handleKeyPress} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div 
          className="flex items-center mt-2 cursor-pointer select-none"
          onClick={() => setSavePassword(!savePassword)}
        >
          <input
            type="checkbox"
            id="savePassword"
            checked={savePassword}
            onChange={() => setSavePassword(!savePassword)}
            className="mr-2 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
          <label htmlFor="savePassword" className="text-sm text-gray-600 cursor-pointer flex-grow">
            Save Password
          </label>
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              {savePassword && <Save className="mr-2 h-4 w-4" />}
              Login
            </>
          )}
        </Button>
      </form>
    </div>
  )
}