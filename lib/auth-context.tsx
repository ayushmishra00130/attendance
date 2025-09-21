"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "teacher" | "student"
  studentId?: string
  subject?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const SAMPLE_USERS: User[] = [
  {
    id: "1",
    name: "Dr. Priya Sharma",
    email: "teacher@edumark.com",
    role: "teacher",
    subject: "Computer Science",
  },
  {
    id: "2",
    name: "Arjun Patel",
    email: "student@edumark.com",
    role: "student",
    studentId: "CS2024001",
  },
  {
    id: "3",
    name: "Prof. Rajesh Kumar",
    email: "teacher2@edumark.com",
    role: "teacher",
    subject: "Mathematics",
  },
  {
    id: "4",
    name: "Meera Singh",
    email: "student2@edumark.com",
    role: "student",
    studentId: "CS2024002",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("edumark-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = SAMPLE_USERS.find((u) => u.email === email)

    if (foundUser && password === "password123") {
      setUser(foundUser)
      localStorage.setItem("edumark-user", JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("edumark-user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
