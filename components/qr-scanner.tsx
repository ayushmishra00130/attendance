"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Camera, CheckCircle, XCircle } from "lucide-react"

interface QRScannerProps {
  onScanSuccess?: (data: string) => void
  onScanError?: (error: string) => void
  className?: string
}

export function QRScanner({ onScanSuccess, onScanError, className }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<"success" | "error" | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)

  const startScanning = async () => {
    setIsScanning(true)
    setScanResult(null)
    setErrorMessage("")

    try {
      // Simulate camera access and QR scanning
      // In a real implementation, you would use a QR code scanning library
      setTimeout(() => {
        const mockScanResult = Math.random() > 0.2 // 80% success rate
        if (mockScanResult) {
          const mockData = `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
          setScanResult("success")
          onScanSuccess?.(mockData)
        } else {
          setScanResult("error")
          setErrorMessage("Invalid QR code or session expired")
          onScanError?.("Invalid QR code")
        }
        setIsScanning(false)
      }, 2000)
    } catch (error) {
      setIsScanning(false)
      setScanResult("error")
      setErrorMessage("Camera access denied")
      onScanError?.("Camera access denied")
    }
  }

  const resetScanner = () => {
    setScanResult(null)
    setErrorMessage("")
    setIsScanning(false)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Scanner
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
              Start Scanning
            </Button>
            <p className="text-sm text-muted-foreground">Position the QR code within the camera view</p>
          </div>
        )}

        {isScanning && (
          <div className="space-y-4">
            <div className="w-64 h-64 mx-auto bg-primary/10 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-4 border-2 border-primary rounded-lg animate-pulse"></div>
              <QrCode className="h-16 w-16 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <p className="font-medium">Scanning for QR code...</p>
              <p className="text-sm text-muted-foreground">Make sure the QR code is clearly visible</p>
            </div>
          </div>
        )}

        {scanResult === "success" && (
          <div className="space-y-4">
            <div className="w-64 h-64 mx-auto bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div className="space-y-2">
              <p className="font-medium text-green-600">Attendance Marked!</p>
              <p className="text-sm text-muted-foreground">Your attendance has been successfully recorded</p>
              <Button variant="outline" size="sm" onClick={resetScanner}>
                Scan Another
              </Button>
            </div>
          </div>
        )}

        {scanResult === "error" && (
          <div className="space-y-4">
            <div className="w-64 h-64 mx-auto bg-red-50 rounded-lg flex items-center justify-center">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <div className="space-y-2">
              <p className="font-medium text-red-600">Scan Failed</p>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={resetScanner}>
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
