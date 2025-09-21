"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QrCode, Eye, EyeOff, LogIn } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [selectedRole, setSelectedRole] = useState<"teacher" | "student">("teacher")

  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)

    if (success) {
      if (selectedRole === "teacher") {
        router.push("/teacher")
      } else {
        router.push("/student")
      }
    } else {
      setError("Invalid email or password. Please try again.")
    }
  }

  const sampleCredentials = [
    { role: "teacher", email: "teacher@edumark.com", name: "Dr. Priya Sharma" },
    { role: "student", email: "student@edumark.com", name: "Arjun Patel" },
    { role: "teacher", email: "teacher2@edumark.com", name: "Prof. Rajesh Kumar" },
    { role: "student", email: "student2@edumark.com", name: "Meera Singh" },
  ]

  const fillSampleCredentials = (email: string, role: "teacher" | "student") => {
    setEmail(email)
    setPassword("password123")
    setSelectedRole(role)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <QrCode className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="text-xl sm:text-2xl font-bold">EduMark</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold mt-4">Welcome Back</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
              Sign In
            </CardTitle>
            <CardDescription className="text-sm">Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="text-sm">I am a:</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={selectedRole === "teacher" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRole("teacher")}
                    className="flex-1 text-sm"
                  >
                    Teacher
                  </Button>
                  <Button
                    type="button"
                    variant={selectedRole === "student" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRole("student")}
                    className="flex-1 text-sm"
                  >
                    Student
                  </Button>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="text-sm"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="text-sm pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full text-sm" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sample Credentials */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Demo Credentials</CardTitle>
            <CardDescription className="text-xs">Click any credential below to auto-fill the form</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleCredentials.map((cred, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto p-3 bg-transparent"
                  onClick={() => fillSampleCredentials(cred.email, cred.role as "teacher" | "student")}
                >
                  <div className="flex flex-col items-start min-w-0">
                    <div className="font-medium text-xs truncate w-full">{cred.name}</div>
                    <div className="text-xs text-muted-foreground truncate w-full">{cred.email}</div>
                    <div className="text-xs text-primary capitalize">{cred.role}</div>
                  </div>
                </Button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground text-center pt-2">
              Password for all accounts: <code className="bg-muted px-1 rounded text-xs">password123</code>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
