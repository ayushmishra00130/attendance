import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { qrData, studentId, location } = await request.json()

    // Parse QR code data
    const parts = qrData.split("-")
    if (parts.length < 4) {
      return NextResponse.json({ success: false, error: "Invalid QR code format" }, { status: 400 })
    }

    const [sessionId, classId, timestamp] = parts
    const qrTimestamp = Number.parseInt(timestamp)
    const currentTime = Date.now()

    // Check if QR code is expired (30 seconds)
    if (currentTime - qrTimestamp > 30 * 1000) {
      return NextResponse.json({ success: false, error: "QR code has expired" }, { status: 400 })
    }

    // Validate location (geofencing)
    // In a real implementation, you would check if the student's location
    // is within the allowed radius of the classroom
    const isLocationValid = validateLocation(location)

    if (!isLocationValid) {
      return NextResponse.json(
        { success: false, error: "You must be in the classroom to mark attendance" },
        { status: 400 },
      )
    }

    // Mark attendance in database
    // In a real implementation, you would:
    // 1. Check if student is enrolled in the class
    // 2. Check if attendance is already marked for this session
    // 3. Insert attendance record
    // 4. Update session statistics

    return NextResponse.json({
      success: true,
      message: "Attendance marked successfully",
      sessionId,
      classId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to validate QR code" }, { status: 500 })
  }
}

function validateLocation(location: { lat: number; lng: number } | null): boolean {
  // In a real implementation, you would:
  // 1. Get the classroom's coordinates from the database
  // 2. Calculate the distance between student and classroom
  // 3. Check if distance is within allowed radius (e.g., 10 meters)

  if (!location) return false

  // For demo purposes, accept any valid GPS coordinates
  // This allows testing without being at a specific physical location
  const hasValidCoordinates = location.lat >= -90 && location.lat <= 90 && location.lng >= -180 && location.lng <= 180

  return hasValidCoordinates

  // Original strict validation (commented out for demo):
  // const classroomLat = 40.7128
  // const classroomLng = -74.006
  // const distance = Math.sqrt(Math.pow(location.lat - classroomLat, 2) + Math.pow(location.lng - classroomLng, 2))
  // return distance < 0.001
}
