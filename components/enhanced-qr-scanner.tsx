"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QrCode, Camera, CheckCircle, XCircle, MapPin, Clock, AlertTriangle } from "lucide-react"

interface EnhancedQRScannerProps {
  onScanSuccess?: (data: any) => void
  onScanError?: (error: string) => void
  className?: string
  currentLocation?: { lat: number; lng: number } | null
  locationPermission?: "granted" | "denied" | "prompt" | "checking" | null
}

export function EnhancedQRScanner({ onScanSuccess, onScanError, className, currentLocation, locationPermission }: EnhancedQRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<"success" | "error" | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [attendanceData, setAttendanceData] = useState<any>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve) => {
      // Use location passed from parent component if available
      if (currentLocation) {
        console.log("[v0] Using location from parent component:", currentLocation)
        resolve(currentLocation)
        return
      }

      // Fallback to demo location if no location provided
      console.log("[v0] No location provided, using demo location")
      resolve({ lat: 40.7128, lng: -74.006 })
    })
  }

  const startScanning = async () => {
    setIsScanning(true)
    setScanResult(null)
    setErrorMessage("")
    setLocation(null)

    try {
      console.log("[v0] Starting QR scan with location request")
      const currentLocation = await getCurrentLocation()
      setLocation(currentLocation)

      console.log("[v0] Location obtained:", currentLocation, "Permission:", locationPermission)

      setTimeout(async () => {
        const mockQrData = `session-123-class-456-${Date.now()}-abc123`

        try {
          const response = await fetch("/api/qr/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              qrData: mockQrData,
              studentId: "student-123",
              location: currentLocation,
            }),
          })

          const data = await response.json()

          if (data.success) {
            setScanResult("success")
            setAttendanceData({
              className: "Mathematics 101",
              time: new Date().toLocaleTimeString(),
              date: new Date().toLocaleDateString(),
              location: "Room 101",
            })
            console.log("[v0] Scan success: Attendance marked successfully")
            onScanSuccess?.(data)

            setTimeout(() => {
              setScanResult(null)
              setAttendanceData(null)
            }, 10000)
          } else {
            setScanResult("error")
            setErrorMessage(data.error || "Failed to mark attendance")
            onScanError?.(data.error)
          }
        } catch (error) {
          setScanResult("error")
          setErrorMessage("Network error. Please try again.")
          onScanError?.(error instanceof Error ? error.message : "Network error")
        }

        setIsScanning(false)
      }, 2000)
    } catch (error) {
      setIsScanning(false)
      setScanResult("error")
      setErrorMessage("Unable to access location. Please enable location access.")
      console.log("[v0] Location error:", error)
    }
  }

  const resetScanner = () => {
    setScanResult(null)
    setErrorMessage("")
    setAttendanceData(null)
    setLocation(null)
    console.log("[v0] Scanner reset")
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Smart QR Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {!isScanning && !scanResult && (
          <div className="space-y-4">
            <div className="w-64 h-64 mx-auto bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
              <Camera className="h-16 w-16 text-muted-foreground" />
            </div>
            <Button onClick={startScanning} size="lg" className="w-full">
              <QrCode className="mr-2 h-4 w-4" />
              Scan Attendance QR
            </Button>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Position QR code in camera view</p>
              <p>• Location verification for security</p>
              <p>• Demo mode available if location blocked</p>
            </div>
          </div>
        )}

        {isScanning && (
          <div className="space-y-4">
            <div className="w-64 h-64 mx-auto bg-primary/10 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-4 border-2 border-primary rounded-lg animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-primary animate-ping rounded-lg"></div>
              <QrCode className="h-16 w-16 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <p className="font-medium">Scanning QR Code...</p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>Requesting location access...</span>
              </div>
              {locationPermission === null && (
                <p className="text-xs text-orange-600">Please allow location access when prompted</p>
              )}
            </div>
          </div>
        )}

        {scanResult === "success" && attendanceData && (
          <div className="space-y-4">
            <div className="w-64 h-64 mx-auto bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-bold text-green-600 text-lg">Attendance Marked!</p>
                <p className="text-sm text-muted-foreground">Successfully recorded your presence</p>
              </div>

              <div className="bg-muted rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Class:</span>
                  <span className="font-medium">{attendanceData.className}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {attendanceData.time}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {attendanceData.location}
                  </span>
                </div>
              </div>

              {locationPermission === "denied" && (
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Demo Mode - Location Blocked
                </Badge>
              )}
              
              {locationPermission === "granted" && currentLocation && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <MapPin className="mr-1 h-3 w-3" />
                  Location Verified
                </Badge>
              )}

              <Button variant="outline" size="sm" onClick={resetScanner}>
                Scan Another QR Code
              </Button>
            </div>
          </div>
        )}

        {scanResult === "error" && (
          <div className="space-y-4">
            <div className="w-64 h-64 mx-auto bg-red-50 rounded-lg flex items-center justify-center">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-bold text-red-600">Scan Failed</p>
                <p className="text-sm text-muted-foreground">{errorMessage}</p>
              </div>

              {errorMessage.includes("expired") && (
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  <Clock className="mr-1 h-3 w-3" />
                  QR Code Expired
                </Badge>
              )}

              {errorMessage.includes("location") && (
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  <MapPin className="mr-1 h-3 w-3" />
                  Demo Mode Active
                </Badge>
              )}

              <Button variant="outline" size="sm" onClick={resetScanner}>
                Try Again
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
