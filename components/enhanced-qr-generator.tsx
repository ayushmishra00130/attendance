"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QrCode, RefreshCw, Clock, Users, Play, Square, X, Maximize2 } from "lucide-react"
import QRCode from "qrcode"

interface EnhancedQRGeneratorProps {
  sessionId: string
  classId: string
  className?: string
  onStudentCountUpdate?: (count: number) => void
}

export function EnhancedQRGenerator({ sessionId, classId, className, onStudentCountUpdate }: EnhancedQRGeneratorProps) {
  const [qrData, setQrData] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [timeLeft, setTimeLeft] = useState(30)
  const [isActive, setIsActive] = useState(false)
  const [studentsPresent, setStudentsPresent] = useState(0)
  const [totalStudents, setTotalStudents] = useState(48)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showFullscreen, setShowFullscreen] = useState(false)

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showFullscreen) {
        setShowFullscreen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showFullscreen])

  // Generate QR code
  const generateQRCode = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/qr/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, classId, teacherId: "teacher-1" }),
      })

      const data = await response.json()
      console.log("QR API Response:", data) // Debug log
      
      if (data.success) {
        setQrData(data.qrData)
        console.log("QR Data received:", data.qrData) // Debug log
        
        // Generate actual QR code image
        try {
          const qrImageUrl = await QRCode.toDataURL(data.qrData, {
            width: 256,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            },
            errorCorrectionLevel: 'M'
          })
          console.log("QR Image generated:", qrImageUrl.substring(0, 50) + "...") // Debug log
          setQrCodeUrl(qrImageUrl)
          setTimeLeft(30)
          setIsActive(true)
          // Only show fullscreen on initial generation, not on auto-refresh
          if (!isActive) {
            setShowFullscreen(true)
          }
        } catch (qrError) {
          console.error("Failed to generate QR code image:", qrError)
          // Still set active even if QR generation fails
          setTimeLeft(30)
          setIsActive(true)
        }
      } else {
        console.error("API returned error:", data.error)
      }
    } catch (error) {
      console.error("Failed to generate QR code:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Fetch attendance stats
  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/attendance/stats?sessionId=${sessionId}&classId=${classId}`)
      const data = await response.json()
      if (data.success) {
        setStudentsPresent(data.stats.presentStudents)
        setTotalStudents(data.stats.totalStudents)
        onStudentCountUpdate?.(data.stats.presentStudents)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            generateQRCode() // Auto-refresh QR code
            return 30
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, sessionId, classId])

  // Fetch stats periodically when active
  useEffect(() => {
    if (isActive) {
      fetchStats() // Initial fetch
      const interval = setInterval(fetchStats, 5000) // Every 5 seconds
      return () => clearInterval(interval)
    }
  }, [isActive])

  const attendancePercentage = totalStudents > 0 ? Math.round((studentsPresent / totalStudents) * 100) : 0

  return (
    <>
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" />
          Live Attendance QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {!isActive ? (
          <div className="space-y-4">
            <div className="w-64 h-64 mx-auto bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
              <QrCode className="h-16 w-16 text-muted-foreground" />
            </div>
            <Button onClick={generateQRCode} size="lg" className="w-full" disabled={isGenerating}>
              {isGenerating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
              {isGenerating ? "Generating..." : "Start Attendance Session"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Generate a QR code for students to scan and mark their attendance
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              {qrCodeUrl ? (
                <div className="relative group cursor-pointer" onClick={() => setShowFullscreen(true)}>
                  <img
                    src={qrCodeUrl}
                    alt="Attendance QR Code"
                    className="w-64 h-64 mx-auto rounded-lg border-2 border-primary shadow-lg bg-white p-2 transition-all group-hover:scale-105"
                    onError={(e) => {
                      console.error("QR Image failed to load:", e)
                    }}
                    onLoad={() => {
                      console.log("QR Image loaded successfully")
                    }}
                  />
                  {/* Expand overlay on hover */}
                  <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-2">
                      <Maximize2 className="h-6 w-6 text-gray-700" />
                    </div>
                  </div>
                </div>
              ) : qrData ? (
                <div className="w-64 h-64 mx-auto bg-yellow-50 rounded-lg flex items-center justify-center border-2 border-yellow-300">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-yellow-600 mx-auto mb-2" />
                    <p className="text-sm text-yellow-700">QR Code Data Ready</p>
                    <p className="text-xs text-yellow-600 mt-1 font-mono break-all px-2">{qrData.substring(0, 30)}...</p>
                  </div>
                </div>
              ) : (
                <div className="w-64 h-64 mx-auto bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-muted-foreground animate-pulse mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Generating QR Code...</p>
                  </div>
                </div>
              )}
              <Badge
                variant="secondary"
                className="absolute top-2 right-2 bg-primary text-primary-foreground animate-pulse"
              >
                <Clock className="mr-1 h-3 w-3" />
                {timeLeft}s
              </Badge>
            </div>

            {qrCodeUrl && (
              <p className="text-xs text-muted-foreground mt-2">
                Click QR code to expand
              </p>
            )}

            {/* Live Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="h-3 w-3" />
                  <span className="text-xs text-muted-foreground">Present</span>
                </div>
                <div className="text-2xl font-bold text-primary">{studentsPresent}</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-xs text-muted-foreground">Attendance</span>
                </div>
                <div className="text-2xl font-bold text-primary">{attendancePercentage}%</div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              {studentsPresent} of {totalStudents} students present
            </div>

            <Button 
              onClick={() => {
                setIsActive(false)
                setQrCodeUrl("")
                setQrData("")
                setTimeLeft(30)
              }} 
              variant="outline" 
              size="sm" 
              className="w-full"
            >
              <Square className="mr-2 h-3 w-3" />
              End Session
            </Button>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Fullscreen QR Modal */}
    {showFullscreen && qrCodeUrl && (
      <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-300">
        {/* Backdrop with blur */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-lg transition-all duration-500"
          onClick={() => setShowFullscreen(false)}
        />
        
        {/* QR Code Container */}
        <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 max-w-2xl mx-4 transform transition-all duration-500 scale-100 animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <QrCode className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold text-gray-900">Attendance QR Code</h3>
            </div>
            <div className="flex items-center gap-2">
              {/* Timer Badge */}
              <Badge className="bg-primary text-primary-foreground animate-pulse">
                <Clock className="mr-1 h-3 w-3" />
                {timeLeft}s
              </Badge>
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullscreen(false)}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Large QR Code */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border-4 border-primary shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl animate-pulse-subtle">
              <img
                src={qrCodeUrl}
                alt="Attendance QR Code - Fullscreen"
                className="w-96 h-96 block rounded-lg"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center space-y-3">
            <p className="text-gray-600 font-medium">
              Students can scan this QR code to mark their attendance
            </p>
            <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{studentsPresent} Present</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Auto-refresh in {timeLeft}s</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowFullscreen(false)}
              className="flex-1"
            >
              <Maximize2 className="mr-2 h-4 w-4 rotate-180" />
              Minimize
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                setIsActive(false)
                setQrCodeUrl("")
                setQrData("")
                setTimeLeft(30)
                setShowFullscreen(false)
              }}
              className="flex-1"
            >
              <Square className="mr-2 h-4 w-4" />
              End Session
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
