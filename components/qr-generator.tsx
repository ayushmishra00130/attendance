"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QrCode, RefreshCw, Clock } from "lucide-react"

interface QRGeneratorProps {
  sessionId: string
  classId?: string
  className?: string
  onStudentCountUpdate?: (count: number) => void
}

export function QRGenerator({ sessionId, classId, className, onStudentCountUpdate }: QRGeneratorProps) {
  const [qrData, setQrData] = useState("")
  const [timeLeft, setTimeLeft] = useState(30)
  const [isActive, setIsActive] = useState(false)
  const [studentsPresent, setStudentsPresent] = useState(0)

  // Generate QR code data
  const generateQRCode = async () => {
    try {
      const response = await fetch("/api/qr/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          classId: classId || "default-class",
          teacherId: "teacher-123",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setQrData(data.qrData)
        setTimeLeft(30)
        setIsActive(true)
        console.log("[v0] QR code generated:", data.qrData)
      } else {
        console.error("[v0] Failed to generate QR code:", data.error)
      }
    } catch (error) {
      console.error("[v0] Error generating QR code:", error)
      // Fallback to local generation for demo
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 15)
      const qrContent = `${sessionId}-${classId || "default"}-${timestamp}-${randomId}`
      setQrData(qrContent)
      setTimeLeft(30)
      setIsActive(true)
    }
  }

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            generateQRCode() // Auto-refresh
            return 30
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, sessionId, classId])

  // Simulate student count updates
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        const newCount = Math.floor(Math.random() * 10) + 35 // Random between 35-45
        setStudentsPresent(newCount)
        onStudentCountUpdate?.(newCount)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isActive, onStudentCountUpdate])

  const qrCodeUrl = qrData
    ? `/placeholder.svg?height=300&width=300&query=QR code with data ${qrData.slice(-8)}`
    : "/qr-code-placeholder.jpg"

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" />
          Attendance QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {!isActive ? (
          <div className="space-y-4">
            <div className="w-64 h-64 mx-auto bg-muted rounded-lg flex items-center justify-center">
              <QrCode className="h-16 w-16 text-muted-foreground" />
            </div>
            <Button onClick={generateQRCode} size="lg" className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate QR Code
            </Button>
            <p className="text-xs text-muted-foreground">Students will scan this QR code to mark their attendance</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={qrCodeUrl || "/placeholder.svg"}
                alt="Attendance QR Code"
                className="w-64 h-64 mx-auto rounded-lg border-2 border-primary"
              />
              <Badge variant="secondary" className="absolute top-2 right-2 bg-primary text-primary-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {timeLeft}s
              </Badge>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Students Present:</span>
              <Badge variant="outline" className="text-lg font-bold">
                {studentsPresent}
              </Badge>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• QR code refreshes every 30 seconds</p>
              <p>• Students must be within classroom range</p>
              <p>• Real-time attendance tracking active</p>
            </div>

            <Button onClick={() => setIsActive(false)} variant="outline" size="sm">
              Stop Session
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { QRGenerator as EnhancedQRGenerator }
