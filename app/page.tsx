import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Users, BarChart3, BookOpen, LogIn } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <QrCode className="h-6 w-6 sm:h-8 sm:w-8" />
              <h1 className="text-xl sm:text-2xl font-bold">EduMark</h1>
            </div>
            <nav className="hidden sm:flex gap-2 lg:gap-4">
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/teacher">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                >
                  Teacher Portal
                </Button>
              </Link>
              <Link href="/student">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                >
                  Student Portal
                </Button>
              </Link>
            </nav>
            <div className="sm:hidden">
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  <LogIn className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
            Smart QR-based Attendance System
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Streamline attendance tracking with secure QR codes, real-time analytics, and geofencing technology
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <QrCode className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-2" />
              <CardTitle className="text-base sm:text-lg">Dynamic QR Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                Auto-refreshing QR codes every 15-30 seconds prevent misuse and ensure security
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-2" />
              <CardTitle className="text-base sm:text-lg">Real-time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                Instant attendance updates with live dashboard showing present students
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-2" />
              <CardTitle className="text-base sm:text-lg">Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                Comprehensive attendance analytics with trends and insights
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-2" />
              <CardTitle className="text-base sm:text-lg">Easy Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                Simple interface for teachers and students with automated record keeping
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-card rounded-lg p-6 sm:p-8 max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Get Started Today</h3>
            <p className="text-muted-foreground mb-6 text-sm sm:text-base">
              Sign in to access your personalized dashboard and start tracking attendance
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>
            <div className="mt-4 text-xs sm:text-sm text-muted-foreground">
              <p>Access your personalized attendance dashboard</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
