-- Creating database schema for attendance system
-- Users table for both students and teachers
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    student_id VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    teacher_id INTEGER REFERENCES users(id),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Class sessions table
CREATE TABLE IF NOT EXISTS class_sessions (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id),
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    qr_code_data TEXT,
    qr_expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance records table
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES class_sessions(id),
    student_id INTEGER REFERENCES users(id),
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    device_info TEXT,
    status VARCHAR(20) DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late'))
);

-- Class enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id),
    student_id INTEGER REFERENCES users(id),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, student_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_session_student ON attendance(session_id, student_id);
CREATE INDEX IF NOT EXISTS idx_class_sessions_active ON class_sessions(is_active, qr_expires_at);
CREATE INDEX IF NOT EXISTS idx_enrollments_class ON enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
