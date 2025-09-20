"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, User, GraduationCap, Copy, LogIn, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DemoCredentialsPage() {
  const { toast } = useToast()

  const sampleUsers = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      email: "teacher@edumark.com",
      role: "teacher",
      subject: "Computer Science",
      department: "Engineering",
      experience: "8 years",
      classes: ["CS101", "CS201", "CS301"],
      description: "Senior Computer Science professor specializing in algorithms and data structures",
    },
    {
      id: "2",
      name: "John Smith",
      email: "student@edumark.com",
      role: "student",
      studentId: "CS2024001",
      year: "3rd Year",
      major: "Computer Science",
      gpa: "3.8",
      enrolledClasses: ["Mathematics 101", "Physics 201", "Computer Science 301"],
      description: "Computer Science major with focus on software development",
    },
    {
      id: "3",
      name: "Prof. Michael Brown",
      email: "teacher2@edumark.com",
      role: "teacher",
      subject: "Mathematics",
      department: "Mathematics",
      experience: "12 years",
      classes: ["MATH101", "MATH201", "STAT301"],
      description: "Mathematics professor with expertise in calculus and statistics",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "student2@edumark.com",
      role: "student",
      studentId: "CS2024002",
      year: "2nd Year",
      major: "Computer Science",
      gpa: "3.9",
      enrolledClasses: ["Mathematics 101", "Physics 201", "Programming Fundamentals"],
      description: "High-achieving student with interest in artificial intelligence",
    },
  ]

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <QrCode className="h-8 w-8" />
              <h1 className="text-2xl font-bold">EduMark Demo Credentials</h1>
            </div>
            <Link href="/">
              <Button variant="secondary" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Demo Account Credentials</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Use these sample accounts to explore the EduMark attendance system. All accounts use the password:{" "}
            <code className="bg-muted px-2 py-1 rounded font-mono">password123</code>
          </p>
        </div>

        {/* Quick Login Section */}
        <div className="text-center mb-8">
          <Link href="/login">
            <Button size="lg" className="mr-4">
              <LogIn className="mr-2 h-5 w-5" />
              Go to Login Page
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-2">
            Click any credential card below to copy the email, then use it on the login page
          </p>
        </div>

        {/* User Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {sampleUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {user.role === "teacher" ? (
                      <GraduationCap className="h-8 w-8 text-primary" />
                    ) : (
                      <User className="h-8 w-8 text-primary" />
                    )}
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription>{user.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={user.role === "teacher" ? "default" : "secondary"} className="capitalize">
                    {user.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Email */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-mono text-sm">{user.email}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(user.email, "Email")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Password</p>
                    <p className="font-mono text-sm">password123</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard("password123", "Password")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {/* Role-specific information */}
                {user.role === "teacher" ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subject:</span>
                      <span className="font-medium">{user.subject}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Department:</span>
                      <span className="font-medium">{user.department}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Experience:</span>
                      <span className="font-medium">{user.experience}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Classes: </span>
                      <span className="font-medium">{user.classes?.join(", ")}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Student ID:</span>
                      <span className="font-medium">{user.studentId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Year:</span>
                      <span className="font-medium">{user.year}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Major:</span>
                      <span className="font-medium">{user.major}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GPA:</span>
                      <span className="font-medium">{user.gpa}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Enrolled: </span>
                      <span className="font-medium">{user.enrolledClasses?.join(", ")}</span>
                    </div>
                  </div>
                )}

                {/* Quick Login Button */}
                <Link href="/login">
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login as {user.name}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle>What You Can Explore</CardTitle>
            <CardDescription>Features available in the demo system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-primary">Teacher Features</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Generate dynamic QR codes for attendance</li>
                  <li>• View real-time attendance statistics</li>
                  <li>• Manage multiple classes and sessions</li>
                  <li>• Access comprehensive analytics dashboard</li>
                  <li>• Export attendance reports</li>
                  <li>• Monitor student attendance trends</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">Student Features</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Scan QR codes to mark attendance</li>
                  <li>• View personal attendance statistics</li>
                  <li>• Track attendance across all classes</li>
                  <li>• Access detailed analytics and trends</li>
                  <li>• View upcoming class schedules</li>
                  <li>• Monitor attendance improvement</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>This is a demo system. All data is simulated for demonstration purposes.</p>
        </div>
      </div>
    </div>
  )
}
