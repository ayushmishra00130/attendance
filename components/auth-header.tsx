"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QrCode, LogOut, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export function AuthHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <QrCode className="h-8 w-8" />
            <h1 className="text-2xl font-bold">EduMark</h1>
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span>{user.name}</span>
                <span className="text-primary-foreground/70">({user.role})</span>
              </div>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <nav className="flex gap-4">
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  Login
                </Button>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
