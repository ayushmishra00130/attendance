"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EnhancedQRGenerator } from "@/components/enhanced-qr-generator"
import { AuthHeader } from "@/components/auth-header"
import { RouteGuard } from "@/components/route-guard"
import { useAuth } from "@/lib/auth-context"
import {
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  Settings,
  Clock,
  UserCheck,
  TrendingUp,
  FileText,
  Download,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

function TeacherDashboardContent() {
  const [studentsPresent, setStudentsPresent] = useState(45)
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("classes")
  const { user } = useAuth()
  const { toast } = useToast()

  const classes = [
    { id: 1, name: "Mathematics 101", code: "MATH101", students: 48, time: "09:00 AM" },
    { id: 2, name: "Physics 201", code: "PHYS201", students: 35, time: "11:00 AM" },
    { id: 3, name: "Computer Science 301", code: "CS301", students: 42, time: "02:00 PM" },
  ]

  const recentSessions = [
    { class: "Mathematics 101", date: "2024-01-15", present: 45, total: 48, percentage: 94 },
    { class: "Physics 201", date: "2024-01-15", present: 32, total: 35, percentage: 91 },
    { class: "Computer Science 301", date: "2024-01-14", present: 38, total: 42, percentage: 90 },
  ]

  const handleNavigation = (tab: string) => {
    setActiveTab(tab)
    toast({
      title: "Navigation",
      description: `Switched to ${tab} section`,
    })
  }

  const handleSettings = () => {
    toast({
      title: "Settings",
      description: "Settings panel would open here",
    })
  }

  const handleReports = () => {
    toast({
      title: "Reports Generated",
      description: "Attendance reports for all classes have been generated",
    })
  }

  const handleClassAnalysis = (className: string) => {
    toast({
      title: "Class Analysis",
      description: `Detailed analysis for ${className} is now available`,
    })
  }

  const handleExportData = () => {
    toast({
      title: "Data Export",
      description: "Attendance data has been exported to CSV format",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />

      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {user?.subject && `${user.subject} Department`} • Manage your classes and track attendance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-sidebar text-sidebar-foreground">
              <CardHeader className="pb-4">
                <CardTitle className="text-sidebar-foreground text-base sm:text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
                  <Button
                    variant={activeTab === "classes" ? "default" : "ghost"}
                    className="flex-shrink-0 lg:w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent text-sm"
                    onClick={() => handleNavigation("classes")}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Classes
                  </Button>
                  <Button
                    variant={activeTab === "attendance" ? "default" : "ghost"}
                    className="flex-shrink-0 lg:w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent text-sm"
                    onClick={() => handleNavigation("attendance")}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Mark Attendance
                  </Button>
                  <Link href="/teacher/analytics" className="flex-shrink-0 lg:w-full">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent text-sm"
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </Button>
                  </Link>
                  <Button
                    variant={activeTab === "reports" ? "default" : "ghost"}
                    className="flex-shrink-0 lg:w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent text-sm"
                    onClick={handleReports}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Reports
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-shrink-0 lg:w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent text-sm"
                    onClick={handleExportData}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                  <Button
                    variant={activeTab === "settings" ? "default" : "ghost"}
                    className="flex-shrink-0 lg:w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent text-sm"
                    onClick={handleSettings}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Students Present</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-primary">{studentsPresent}</div>
                  <p className="text-xs text-muted-foreground">+12% from last session</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-primary">3</div>
                  <p className="text-xs text-muted-foreground">Total enrolled: 125 students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-primary">92%</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* QR Code Generator and Today's Classes */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <EnhancedQRGenerator
                sessionId="session-123"
                classId="class-456"
                onStudentCountUpdate={setStudentsPresent}
              />

              {/* Today's Classes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                    Today's Classes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {classes.map((cls) => (
                    <div
                      key={cls.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base">{cls.name}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {cls.code} • {cls.students} students
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs sm:text-sm">{cls.time}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              setActiveSession(cls.id.toString())
                              toast({
                                title: activeSession === cls.id.toString() ? "Session Active" : "Session Started",
                                description: `${cls.name} attendance session is now ${activeSession === cls.id.toString() ? "running" : "active"}`,
                              })
                            }}
                            disabled={activeSession === cls.id.toString()}
                          >
                            {activeSession === cls.id.toString() ? "Active" : "Start"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleClassAnalysis(cls.name)}>
                            <BarChart3 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Recent Sessions</CardTitle>
                <CardDescription className="text-sm">Latest attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.map((session, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base">{session.class}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">{session.date}</p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {session.present}/{session.total}
                          </div>
                          <div className="text-xs text-muted-foreground">students</div>
                        </div>
                        <Badge
                          variant={session.percentage >= 90 ? "default" : "secondary"}
                          className={`text-xs ${session.percentage >= 90 ? "bg-green-500" : ""}`}
                        >
                          {session.percentage}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TeacherDashboard() {
  return (
    <RouteGuard requiredRole="teacher">
      <TeacherDashboardContent />
    </RouteGuard>
  )
}
