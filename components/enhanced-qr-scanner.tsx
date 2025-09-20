"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QrCode, Camera, CheckCircle, XCircle, MapPin, Clock, AlertTriangle, CameraOff } from "lucide-react"
import QrScanner from "qr-scanner"

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
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt" | "checking" | null>(null)
  const [hasCamera, setHasCamera] = useState<boolean | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const qrScannerRef = useRef<QrScanner | null>(null)

  // Check camera availability and permissions
  useEffect(() => {
    const checkCameraSupport = async () => {
      try {
        const hasCamera = await QrScanner.hasCamera()
        setHasCamera(hasCamera)
        
        if (!hasCamera) {
          console.log("No camera available on this device")
          return
        }

        // Check camera permission
        if ('permissions' in navigator) {
          try {
            const permission = await navigator.permissions.query({ name: 'camera' as PermissionName })
            setCameraPermission(permission.state as any)
            console.log("Camera permission state:", permission.state)
          } catch (error) {
            console.log("Permission query not supported, will request on scan")
            setCameraPermission("prompt")
          }
        } else {
          setCameraPermission("prompt")
        }
      } catch (error) {
        console.error("Error checking camera support:", error)
        setHasCamera(false)
      }
    }

    checkCameraSupport()
  }, [])

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop()
        qrScannerRef.current.destroy()
      }
    }
  }, [])

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
    if (!hasCamera) {
      setErrorMessage("No camera available on this device")
      setScanResult("error")
      onScanError?.("No camera available")
      return
    }

    setIsScanning(true)
    setScanResult(null)
    setErrorMessage("")
    setLocation(null)
    setCameraPermission("checking")

    try {
      console.log("[v0] Starting camera-based QR scan")
      
      // Get location first
      const currentLocationData = await getCurrentLocation()
      setLocation(currentLocationData)

      if (!videoRef.current) {
        throw new Error("Video element not available")
      }

      // Initialize QR Scanner
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        async (result) => {
          console.log("[v0] QR Code detected:", result.data)
          
          // Stop scanning
          if (qrScannerRef.current) {
            qrScannerRef.current.stop()
          }
          setIsScanning(false)

          // Validate the QR code
          try {
            const response = await fetch("/api/qr/validate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                qrData: result.data,
                studentId: "student-123",
                location: currentLocationData,
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
        },
        {
          onDecodeError: (error) => {
            // Don't log every decode error, only actual problems
            const errorMsg = typeof error === 'string' ? error : error.message
            if (!errorMsg.includes('No QR code found')) {
              console.log("[v0] QR decode error:", errorMsg)
            }
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 5,
        }
      )

      // Start the scanner
      await qrScannerRef.current.start()
      setCameraPermission("granted")
      console.log("[v0] Camera started successfully")

    } catch (error: any) {
      console.error("[v0] Camera error:", error)
      setIsScanning(false)
      setScanResult("error")
      
      if (error.name === 'NotAllowedError' || error.message.includes('Permission denied')) {
        setCameraPermission("denied")
        setErrorMessage("Camera permission denied. Please allow camera access to scan QR codes.")
        onScanError?.("Camera permission denied")
      } else if (error.name === 'NotFoundError') {
        setErrorMessage("No camera found on this device.")
        onScanError?.("No camera found")
      } else if (error.name === 'NotSupportedError') {
        setErrorMessage("Camera not supported in this browser.")
        onScanError?.("Camera not supported")
      } else {
        setCameraPermission("denied")
        setErrorMessage("Failed to access camera. Please check permissions and try again.")
        onScanError?.(error.message || "Camera access failed")
      }
    }
  }

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop()
    }
    setIsScanning(false)
  }

  const resetScanner = () => {
    stopScanning()
    setScanResult(null)
    setErrorMessage("")
    setAttendanceData(null)
    setLocation(null)
    setCameraPermission("prompt")
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
            <div className="w-64 h-64 mx-auto bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25 relative">
              {hasCamera === false ? (
                <div className="text-center">
                  <CameraOff className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No camera available</p>
                  <p className="text-xs text-muted-foreground mt-1">Use a device with camera</p>
                </div>
              ) : cameraPermission === "denied" ? (
                <div className="text-center">
                  <CameraOff className="h-16 w-16 text-red-400 mx-auto mb-2" />
                  <p className="text-sm text-red-600">Camera access denied</p>
                  <p className="text-xs text-red-500 mt-1">Enable in browser settings</p>
                </div>
              ) : hasCamera === null ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Checking camera...</p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="h-16 w-16 text-primary mx-auto mb-2 animate-pulse" />
                  <p className="text-sm text-foreground font-medium">Ready to scan QR code</p>
                  <p className="text-xs text-muted-foreground mt-1">Click button to start camera</p>
                </div>
              )}
            </div>
            
            <Button 
              onClick={startScanning} 
              size="lg" 
              className="w-full"
              disabled={hasCamera === false}
            >
              <Camera className="mr-2 h-4 w-4" />
              {hasCamera === false ? "No Camera Available" : "Start Camera & Scan QR"}
            </Button>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Allow camera access when prompted</p>
              <p>• Position QR code clearly in camera view</p>
              <p>• Location verification for security</p>
              {cameraPermission === "denied" && (
                <p className="text-orange-600">• Please enable camera in browser settings</p>
              )}
            </div>
          </div>
        )}

        {isScanning && (
          <div className="space-y-4">
            <div className="relative w-64 h-64 mx-auto rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              {/* Scan overlay */}
              <div className="absolute inset-0 border-2 border-primary rounded-lg">
                <div className="absolute inset-4 border-2 border-primary/50 rounded-lg animate-pulse">
                  {/* Corner indicators */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                </div>
              </div>
              
              {/* Camera permission status */}
              {cameraPermission === "checking" && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-2"></div>
                    <p className="text-sm">Requesting camera access...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2 text-center">
              <p className="font-medium">Scanning for QR Code...</p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Camera className="h-3 w-3" />
                  <span>Camera Active</span>
                </div>
                {currentLocation && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>Location Ready</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Position QR code in the center of the frame</p>
            </div>
            
            <Button onClick={stopScanning} variant="outline" size="sm" className="w-full">
              Stop Scanning
            </Button>
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
              
              {cameraPermission === "granted" && (
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  <Camera className="mr-1 h-3 w-3" />
                  Camera Verified
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

              {errorMessage.includes("Camera") && (
                <Badge variant="outline" className="text-red-600 border-red-200">
                  <CameraOff className="mr-1 h-3 w-3" />
                  Camera Error
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
