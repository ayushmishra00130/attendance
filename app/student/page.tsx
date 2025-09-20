"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AuthHeader } from "@/components/auth-header"
import { RouteGuard } from "@/components/route-guard"
import { useAuth } from "@/lib/auth-context"
import { User, Calendar, BarChart3, BookOpen, Clock, CheckCircle, XCircle, TrendingUp, MapPin } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { EnhancedQRScanner } from "@/components/enhanced-qr-scanner"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const upcomingClasses = [
  { name: "Mathematics", day: "Monday", time: "09:00 AM", room: "Room 101" },
  { name: "Physics", day: "Tuesday", time: "11:00 AM", room: "Room 205" },
  { name: "Computer Science", day: "Wednesday", time: "02:00 PM", room: "Lab 301" },
]

function StudentPortalContent() {
  const [scanMessage, setScanMessage] = useState<string | null>(null)
  const [attendanceData, setAttendanceData] = useState([
    { week: 1, percentage: 80 },
    { week: 2, percentage: 85 },
    { week: 3, percentage: 88 },
    { week: 4, percentage: 86 },
  ])
  const [totalClasses, setTotalClasses] = useState(25)
  const [presentClasses, setPresentClasses] = useState(22)
  const [recentAttendance, setRecentAttendance] = useState([
    { subject: "Mathematics", status: "present", date: "Jan 15" },
    { subject: "Physics", status: "present", date: "Jan 14" },
    { subject: "Computer Science", status: "absent", date: "Jan 13" },
    { subject: "Mathematics", status: "present", date: "Jan 12" },
  ])
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt" | "checking" | null>(null)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)

  const { user, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const attendancePercentage = Math.round((presentClasses / totalClasses) * 100)

  // Request location permission on component mount
  useEffect(() => {
    const requestLocationPermission = async () => {
      setLocationPermission("checking")
      
      if (!navigator.geolocation) {
        console.log("Geolocation not supported by this browser")
        setLocationPermission("denied")
        toast({
          title: "Location Not Supported",
          description: "Your browser doesn't support location services. Demo mode will be used.",
          variant: "destructive",
        })
        return
      }

      try {
        // First check current permission state
        if ('permissions' in navigator) {
          const permission = await navigator.permissions.query({ name: 'geolocation' })
          console.log("Current geolocation permission:", permission.state)
          
          if (permission.state === 'granted') {
            // Permission already granted, get location
            getCurrentLocation()
          } else if (permission.state === 'denied') {
            setLocationPermission("denied")
            showLocationDeniedMessage()
          } else {
            // Permission not determined, request it
            requestLocation()
          }
        } else {
          // Fallback for browsers without permissions API
          requestLocation()
        }
      } catch (error) {
        console.error("Permission query failed:", error)
        requestLocation()
      }
    }

    const getCurrentLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLocationPermission("granted")
          toast({
            title: "Location Access Granted",
            description: `Location detected: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
          })
        },
        (error) => {
          console.error("Location access error:", error)
          setLocationPermission("denied")
          showLocationDeniedMessage()
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // Cache for 1 minute
        }
      )
    }

    const requestLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLocationPermission("granted")
          toast({
            title: "Location Access Granted ✓",
            description: `Location: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
          })
        },
        (error) => {
          console.error("Location request failed:", error)
          setLocationPermission("denied")
          
          if (error.code === error.PERMISSION_DENIED) {
            showLocationDeniedMessage()
          } else if (error.code === error.TIMEOUT) {
            toast({
              title: "Location Timeout",
              description: "Location request timed out. Demo mode will be used.",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Location Error",
              description: "Unable to get your location. Demo mode will be used.",
              variant: "destructive",
            })
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0, // Force fresh request
        }
      )
    }

    const showLocationDeniedMessage = () => {
      toast({
        title: "Location Access Required",
        description: "Please enable location access in your browser settings for attendance verification. Demo mode will be used for now.",
        variant: "destructive",
      })
    }

    // Start the permission request process
    requestLocationPermission()
  }, [toast]) // Only run once on mount

  const handleScanSuccess = (data: any) => {
    console.log("[v0] Scan success:", data)
    setScanMessage("Attendance marked successfully!")
    setTimeout(() => {
      setScanMessage(null)
    }, 10000)

    setPresentClasses((prev) => prev + 1)
    setTotalClasses((prev) => prev + 1)
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const newRecord = {
      subject: "Current Class",
      status: "present" as const,
      date: today,
    }
    setRecentAttendance((prev) => [newRecord, ...prev.slice(0, 3)])
    setAttendanceData((prev) => {
      const newData = prev.map((item, index) => {
        if (index === prev.length - 1) {
          return {
            ...item,
            percentage: Math.min(100, item.percentage + 2),
          }
        }
        return item
      })
      return newData
    })
    toast({
      title: "Attendance Marked!",
      description: "Your attendance has been successfully recorded",
    })
  }

  const handleScanError = (error: string) => {
    console.log("[v0] Scan error handled:", error)
    setScanMessage(`Scan issue: ${error}`)
    setTimeout(() => {
      setScanMessage(null)
    }, 10000)

    toast({
      title: "Scan Failed",
      description: error,
      variant: "destructive",
    })
  }

  const handleViewSchedule = () => {
    toast({
      title: "Full Schedule",
      description: "Complete class schedule would open here",
    })
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    })
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />

      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Welcome, {user?.name}!</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {user?.studentId && `Student ID: ${user.studentId}`} • Track your attendance and stay updated with your
            classes
          </p>
        </div>

        {/* Location Status Banner */}
        <div className="mb-4 sm:mb-6">
          {locationPermission === "checking" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              <span className="text-blue-700 text-sm font-medium">Requesting location permission...</span>
            </div>
          )}
          
          {locationPermission === "granted" && currentLocation && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <span className="text-green-700 text-sm font-medium">Location Access Granted ✓</span>
                <p className="text-green-600 text-xs mt-1">
                  Coordinates: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                </p>
              </div>
            </div>
          )}
          
          {locationPermission === "denied" && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-3">
              <XCircle className="h-4 w-4 text-orange-600" />
              <div className="flex-1">
                <span className="text-orange-700 text-sm font-medium">Location Access Denied</span>
                <p className="text-orange-600 text-xs mt-1">
                  Demo mode active. Enable location in browser settings for full functionality.
                </p>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  toast({
                    title: "Refreshing Page",
                    description: "Reloading to request location permission again...",
                  })
                  setTimeout(() => window.location.reload(), 1000)
                }}
                className="text-xs"
              >
                <MapPin className="mr-1 h-3 w-3" />
                Retry
              </Button>
            </div>
          )}
        </div>

        {scanMessage && (
          <div className="mb-4 sm:mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">{scanMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Attendance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Your Attendance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <div className="text-4xl sm:text-6xl font-bold text-primary mb-2">{attendancePercentage}%</div>
                <p className="text-muted-foreground text-sm sm:text-base">Total Classes: {totalClasses}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Present</span>
                  <span className="font-medium">{presentClasses} classes</span>
                </div>
                <Progress value={(presentClasses / totalClasses) * 100} className="h-2" />

                <div className="flex justify-between text-sm">
                  <span>Absent</span>
                  <span className="font-medium">{totalClasses - presentClasses} classes</span>
                </div>
                <Progress value={((totalClasses - presentClasses) / totalClasses) * 100} className="h-2 bg-red-100" />
              </div>
            </CardContent>
          </Card>

          {/* QR Scanner */}
          <EnhancedQRScanner 
            onScanSuccess={handleScanSuccess} 
            onScanError={handleScanError}
            currentLocation={currentLocation}
            locationPermission={locationPermission}
          />

          {/* Attendance Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                Attendance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[70, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-2 mt-4">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs sm:text-sm text-green-600 font-medium">
                  {attendancePercentage >= 86 ? "+" : ""}
                  {attendancePercentage - 80}% from baseline
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                Upcoming Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingClasses.map((cls, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-medium text-sm sm:text-base truncate">{cls.name}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">{cls.room}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs sm:text-sm font-medium">{cls.day}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {cls.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent text-sm" onClick={handleViewSchedule}>
                <Calendar className="mr-2 h-4 w-4" />
                View Full Schedule
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Attendance */}
        <Card className="mt-4 sm:mt-6">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Recent Attendance</CardTitle>
            <CardDescription className="text-sm">Your attendance record for the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {recentAttendance.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm truncate">{record.subject}</h4>
                    <p className="text-xs text-muted-foreground">{record.date}</p>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {record.status === "present" ? (
                      <Badge className="bg-green-500 text-xs">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Present
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        <XCircle className="mr-1 h-3 w-3" />
                        Absent
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function StudentPortal() {
  return (
    <RouteGuard requiredRole="student">
      <StudentPortalContent />
    </RouteGuard>
  )
}
